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
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Shared.Serialization;

namespace sciencehub_backend.Features.Submissions.Services
{
    public class SubmissionService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SubmissionService> _logger;
        private readonly DatabaseValidation _databaseValidation;
        private readonly CustomJsonSerializer _serializer;

        public SubmissionService(AppDbContext context, ILogger<SubmissionService> logger)
        {
            _context = context;
            _logger = logger;
            _databaseValidation = new DatabaseValidation(context);
            _serializer = new CustomJsonSerializer();
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
                        _context.Entry(newProjectSubmission).Property(p => p.ProjectDeltaJson).IsModified = false;
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
                            _logger.LogInformation($"Adding user {userId} to project submission {newWorkSubmission.Id}");

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
                    GraphData = new GraphData()
                };
                _context.ProjectGraphs.Add(projectGraph);
            }

            // Update the project graph:
            // Add node = final version id, and edge between current submission's initial and final version ids
            var initialVersionIdStr = initialProjectVersionId.ToString();
            var finalVersionIdStr = finalProjectVersionId.ToString();

            if (!projectGraph.GraphData.ContainsKey(initialVersionIdStr))
            {
                projectGraph.GraphData[initialVersionIdStr] = new GraphNode
                {
                    Neighbors = new List<string>(),
                    IsSnapshot = false
                };
            }
            projectGraph.GraphData[initialVersionIdStr].Neighbors.Add(finalVersionIdStr);

            if (!projectGraph.GraphData.ContainsKey(finalVersionIdStr))
            {
                projectGraph.GraphData[finalVersionIdStr] = new GraphNode
                {
                    Neighbors = new List<string>(),
                    IsSnapshot = false
                };
            }
            projectGraph.GraphData[finalVersionIdStr].Neighbors.Add(initialVersionIdStr);

            // Force update the serialized JSON
            projectGraph.GraphDataJson = _serializer.SerializeToJson(projectGraph.GraphData);

            // Save
            await _context.SaveChangesAsync();

        }

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
                    WorkType = workType,
                    GraphData = new GraphData()
                };
                _context.WorkGraphs.Add(workGraph);
            }

            // Update the work graph:
            // Add node = final version id, and edge between current submission's initial and final version ids
            var initialVersionIdStr = initialWorkVersionId.ToString();
            var finalVersionIdStr = finalWorkVersionId.ToString();

            // Add or update the initial version node
            if (!workGraph.GraphData.ContainsKey(initialVersionIdStr))
            {
                workGraph.GraphData[initialVersionIdStr] = new GraphNode();
            }
            workGraph.GraphData[initialVersionIdStr].Neighbors.Add(finalVersionIdStr);

            // Add or update the final version node
            if (!workGraph.GraphData.ContainsKey(finalVersionIdStr))
            {
                workGraph.GraphData[finalVersionIdStr] = new GraphNode();
            }
            workGraph.GraphData[finalVersionIdStr].Neighbors.Add(initialVersionIdStr);

            workGraph.GraphDataJson = _serializer.SerializeToJson(workGraph.GraphData);

            _context.WorkGraphs.Update(workGraph);
            await _context.SaveChangesAsync();
        }
    }
}
