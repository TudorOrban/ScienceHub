using sciencehub_backend.Data;
using sciencehub_backend.Features.Submissions.Dto;
using sciencehub_backend.Features.Submissions.Models;
using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Projects.Dto;
using sciencehub_backend.Shared.Validation;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Shared.Enums;

namespace sciencehub_backend.Features.Submissions.Services
{
    public class SubmissionService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SubmissionService> _logger;
        private readonly DatabaseValidation _databaseValidation;

        public SubmissionService(AppDbContext context, ILogger<SubmissionService> logger)
        {
            _context = context;
            _logger = logger;
            _databaseValidation = new DatabaseValidation(context);
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

        public async Task<int> CreateSubmissionAsync(CreateSubmissionDto createSubmissionDto, SanitizerService sanitizerService)
        {
            // Use transaction
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Create project or work submission
                switch (createSubmissionDto.SubmissionObjectType)
                {
                    case "Project":
                        var projectId = await _databaseValidation.ValidateProjectId(createSubmissionDto.ProjectId);
                        var initialProjectVersionId = await _databaseValidation.ValidateProjectVersionId(createSubmissionDto.InitialProjectVersionId);

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
                            Title = sanitizerService.Sanitize(createSubmissionDto.Title),
                            Description = sanitizerService.Sanitize(createSubmissionDto.Description),
                            Public = createSubmissionDto.Public,
                        };
                        _context.ProjectSubmissions.Add(newProjectSubmission);
                        await _context.SaveChangesAsync();

                        // Add the users to project submission
                        foreach (var userIdString in createSubmissionDto.Users)
                        {
                            // Verify provided userId is valid UUID and exists in database
                            var userId = await _databaseValidation.ValidateUserId(userIdString);
                            _logger.LogInformation($"Adding user {userId} to project submission {newProjectSubmission.Id}");
                            _context.ProjectSubmissionUsers.Add(new ProjectSubmissionUser { ProjectSubmissionId = newProjectSubmission.Id, UserId = userId });
                        }
                        await _context.SaveChangesAsync();

                        // Update the project graph
                        await UpdateProjectGraphAsync(projectId, initialProjectVersionId, newProjectVersion.Id);

                        // Commit the transaction
                        transaction.Commit();

                        return newProjectSubmission.Id;
                    case "Work":
                        // TODO: Add validation for (workId, workType)
                        var workId = createSubmissionDto.WorkId.Value;
                        var workTypeEnum = EnumParser.ParseWorkType(createSubmissionDto.WorkType);
                        if (!workTypeEnum.HasValue)
                        {
                            _logger.LogWarning($"Invalid workType string: {createSubmissionDto.WorkType}");
                            throw new InvalidWorkTypeException();
                        }

                        var initialWorkVersionId = await _databaseValidation.ValidateWorkVersionId(createSubmissionDto.InitialWorkVersionId, workTypeEnum.Value);

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
                            Title = sanitizerService.Sanitize(createSubmissionDto.Title),
                            Description = sanitizerService.Sanitize(createSubmissionDto.Description),
                            Public = createSubmissionDto.Public,
                        };
                        _context.WorkSubmissions.Add(newWorkSubmission);
                        await _context.SaveChangesAsync();

                        // Add the users to work submission
                        foreach (var userIdString in createSubmissionDto.Users)
                        {
                            // Verify provided userId is valid UUID and exists in database
                            var userId = await _databaseValidation.ValidateUserId(userIdString);

                            _context.WorkSubmissionUsers.Add(new WorkSubmissionUser { WorkSubmissionId = newWorkSubmission.Id, UserId = userId });
                        }
                        await _context.SaveChangesAsync();

                        // Update the work graph
                        await UpdateWorkGraphAsync(workId, workTypeEnum.Value, initialWorkVersionId, newWorkVersion.Id);

                        // Add work submission to project submission
                        var projectSubmissionId = await _databaseValidation.ValidateProjectSubmissionId(createSubmissionDto.ProjectSubmissionId);
                        _context.ProjectWorkSubmissions.Add(new ProjectWorkSubmission { ProjectSubmissionId = projectSubmissionId, WorkSubmissionId = newWorkSubmission.Id });
                        await _context.SaveChangesAsync();


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

        // TODO: Fix, not currently working properly
        private async Task UpdateProjectGraphAsync(int projectId, int initialProjectVersionId, int finalProjectVersionId)
        {
            // Retrieve the existing project graph
            var projectGraph = await _context.ProjectGraphs
                .FirstOrDefaultAsync(pg => pg.ProjectId == projectId);

            if (projectGraph == null)
            {
                // Handle the case where the project graph doesn't exist yet
                // TODO: Handle more gracefully in the future
                projectGraph = new ProjectGraph
                {
                    ProjectId = projectId,
                    GraphDataParsed = new Dictionary<string, Projects.Models.GraphNode>()
                };
                _context.ProjectGraphs.Add(projectGraph);
            }

            // Update the project graph:
            // Add node = final version id, and edge between current submission's initial and final version ids
            var initialVersionIdStr = initialProjectVersionId.ToString();
            var finalVersionIdStr = finalProjectVersionId.ToString();

            if (projectGraph.GraphDataParsed.ContainsKey(initialVersionIdStr))
            {
                projectGraph.GraphDataParsed[initialVersionIdStr].Neighbors.Add(finalVersionIdStr);
            }
            else
            {
                projectGraph.GraphDataParsed.Add(initialVersionIdStr, new Projects.Models.GraphNode
                {
                    Neighbors = new List<string> { finalVersionIdStr },
                    IsSnapshot = false
                });
            }

            projectGraph.GraphDataParsed.Add(finalVersionIdStr, new Projects.Models.GraphNode
            {
                Neighbors = new List<string> { initialVersionIdStr },
                IsSnapshot = false
            });

            // Save the updated graph to the database
            _context.ProjectGraphs.Update(projectGraph);
            await _context.SaveChangesAsync();

        }

        // TODO: Fix, not currently working properly
        private async Task UpdateWorkGraphAsync(int workId, WorkType workType, int initialWorkVersionId, int finalWorkVersionId)
        {
            // Retrieve the existing work graph
            var workGraph = await _context.WorkGraphs
                .FirstOrDefaultAsync(wg => wg.WorkId == workId && wg.WorkType == workType);

            if (workGraph == null)
            {
                // Handle the case where the work graph doesn't exist yet
                // TODO: Handle more gracefully in the future
                workGraph = new WorkGraph
                {
                    WorkId = workId,
                    GraphDataParsed = new Dictionary<string, Works.Models.GraphNode>()
                };
                _context.WorkGraphs.Add(workGraph);
            }

            // Update the work graph:
            // Add node = final version id, and edge between current submission's initial and final version ids
            var initialVersionIdStr = initialWorkVersionId.ToString();
            var finalVersionIdStr = finalWorkVersionId.ToString();

            if (workGraph.GraphDataParsed.ContainsKey(initialVersionIdStr))
            {
                workGraph.GraphDataParsed[initialVersionIdStr].Neighbors.Add(finalVersionIdStr);
            }
            else
            {
                workGraph.GraphDataParsed.Add(initialVersionIdStr, new Works.Models.GraphNode
                {
                    Neighbors = new List<string> { finalVersionIdStr },
                    IsSnapshot = false
                });
            }

            workGraph.GraphDataParsed.Add(finalVersionIdStr, new Works.Models.GraphNode
            {
                Neighbors = new List<string> { initialVersionIdStr },
                IsSnapshot = false
            });

            // Save the updated graph to the database
            _context.WorkGraphs.Update(workGraph);
            await _context.SaveChangesAsync();
        }
    }
}
