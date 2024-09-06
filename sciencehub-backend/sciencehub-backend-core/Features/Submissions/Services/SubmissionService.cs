using sciencehub_backend_core.Data;
using sciencehub_backend_core.Features.Submissions.DTO;
using sciencehub_backend_core.Features.Submissions.Models;
using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Projects.Models;
using sciencehub_backend_core.Shared.Validation;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Reconstruction.Services;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend_core.Shared.Sanitation;

namespace sciencehub_backend_core.Features.Submissions.Services
{
    public class SubmissionService : ISubmissionService
    {
        private readonly CoreServiceDbContext _context;
        private readonly ILogger<SubmissionService> _logger;
        private readonly IGraphService _graphService;
        private readonly ISanitizerService _sanitizerService;
        private readonly IDatabaseValidation _databaseValidation;

        public SubmissionService(CoreServiceDbContext context, ILogger<SubmissionService> logger, IGraphService graphService, ISanitizerService sanitizerService, IDatabaseValidation databaseValidation)
        {
            _context = context;
            _logger = logger;
            _graphService = graphService;
            _sanitizerService = sanitizerService;
            _databaseValidation = databaseValidation;
        }

        public async Task<WorkSubmission> GetWorkSubmissionAsync(int workSubmissionId)
        {
            var workSubmission = await _context.WorkSubmissions
                .FirstOrDefaultAsync(s => s.Id == workSubmissionId);

            if (workSubmission == null)
            {
                _logger.LogWarning($"WorkSubmission with id {workSubmissionId} not found.");
                throw new InvalidSubmissionIdException();
            }

            return workSubmission;
        }

        public async Task<int> CreateSubmissionAsync(CreateSubmissionDTO createSubmissionDTO)
        {
            // Use transaction
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Create project or work submission
                switch (createSubmissionDTO.SubmissionObjectType)
                {
                    case "Project":
                        var projectId = await _databaseValidation.ValidateProjectId(createSubmissionDTO.ProjectId);
                        var initialProjectVersionId = await _databaseValidation.ValidateProjectVersionId(createSubmissionDTO.InitialProjectVersionId);

                        // Generate a new project version
                        var newProjectVersion = new ProjectVersion
                        {
                            ProjectId = projectId,
                        };
                        _context.ProjectVersions.Add(newProjectVersion);
                        await _context.SaveChangesAsync();

                        // Create the project submission
                        var newProjectSubmission = new ProjectSubmission
                        {
                            ProjectId = projectId,
                            InitialProjectVersionId = initialProjectVersionId,
                            FinalProjectVersionId = newProjectVersion.Id,
                            Title = _sanitizerService.Sanitize(createSubmissionDTO.Title),

                            Description = _sanitizerService.Sanitize(createSubmissionDTO.Description),
                            Public = createSubmissionDTO.Public,
                        };
                        _context.ProjectSubmissions.Add(newProjectSubmission);
                        _context.Entry(newProjectSubmission).Property(p => p.ProjectDeltaJson).IsModified = false;
                        await _context.SaveChangesAsync();

                        // Add the users to project submission
                        foreach (var userIdString in createSubmissionDTO.Users)
                        {
                            // Verify provided userId is valid UUID and exists in database
                            var userId = await _databaseValidation.ValidateUserId(userIdString);
                            _logger.LogInformation($"Adding user {userId} to project submission {newProjectSubmission.Id}");
                            _context.ProjectSubmissionUsers.Add(new ProjectSubmissionUser { ProjectSubmissionId = newProjectSubmission.Id, UserId = userId });
                        }
                        await _context.SaveChangesAsync();

                        // Update the project graph
                        await _graphService.UpdateProjectGraphAsync(projectId, initialProjectVersionId, newProjectVersion.Id);

                        // Commit the transaction
                        transaction.Commit();

                        return newProjectSubmission.Id;
                    case "Work":
                        // TODO: Add validation for (workId, workType)
                        if (!createSubmissionDTO.WorkId.HasValue)
                        {
                            _logger.LogWarning("WorkId is required for Work Submission.");
                            throw new InvalidWorkIdException();
                        }
                        var workId = createSubmissionDTO.WorkId.Value;
                        var workTypeEnum = EnumParser.ParseWorkType(createSubmissionDTO.WorkType);
                        if (!workTypeEnum.HasValue)
                        {
                            _logger.LogWarning($"Invalid workType string: {createSubmissionDTO.WorkType}");
                            throw new InvalidWorkTypeException();
                        }

                        var initialWorkVersionId = await _databaseValidation.ValidateWorkVersionId(createSubmissionDTO.InitialWorkVersionId, workTypeEnum.Value);

                        // Generate a new work version
                        var newWorkVersion = new WorkVersion
                        {
                            WorkId = workId,
                            WorkType = workTypeEnum.Value,
                        };
                        _context.WorkVersions.Add(newWorkVersion);
                        await _context.SaveChangesAsync();

                        // Create the work submission
                        var newWorkSubmission = new WorkSubmission
                        {
                            WorkId = workId,
                            WorkType = workTypeEnum.Value,
                            InitialWorkVersionId = initialWorkVersionId,
                            FinalWorkVersionId = newWorkVersion.Id,
                            Title = _sanitizerService.Sanitize(createSubmissionDTO.Title),
                            Description = _sanitizerService.Sanitize(createSubmissionDTO.Description),
                            Public = createSubmissionDTO.Public,
                        };
                        _context.WorkSubmissions.Add(newWorkSubmission);
                        await _context.SaveChangesAsync();

                        // Add the users to work submission
                        foreach (var userIdString in createSubmissionDTO.Users)
                        {
                            // Verify provided userId is valid UUID and exists in database
                            var userId = await _databaseValidation.ValidateUserId(userIdString);
                            _logger.LogInformation($"Adding user {userId} to project submission {newWorkSubmission.Id}");

                            _context.WorkSubmissionUsers.Add(new WorkSubmissionUser { WorkSubmissionId = newWorkSubmission.Id, UserId = userId });
                        }
                        await _context.SaveChangesAsync();

                        // Update the work graph
                        await _graphService.UpdateWorkGraphAsync(workId, workTypeEnum.Value, initialWorkVersionId, newWorkVersion.Id);

                        // Add work submission to project submission
                        if (createSubmissionDTO.ProjectSubmissionId != null)
                        {
                            var projectSubmissionId = await _databaseValidation.ValidateProjectSubmissionId(createSubmissionDTO.ProjectSubmissionId);
                            _context.ProjectWorkSubmissions.Add(new ProjectWorkSubmission { ProjectSubmissionId = projectSubmissionId, WorkSubmissionId = newWorkSubmission.Id });
                            await _context.SaveChangesAsync();
                        }

                        // Commit the transaction
                        transaction.Commit();

                        return newWorkSubmission.Id;
                    default:
                        throw new Exception("Invalid Submission Object Type.");
                }
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError(ex, "Error creating submission");
                throw;
            }
        }

        
    }
}
