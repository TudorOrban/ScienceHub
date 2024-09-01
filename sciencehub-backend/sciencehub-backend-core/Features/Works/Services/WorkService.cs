using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Submissions.Models;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend_core.Features.Works.DTO;
using sciencehub_backend_core.Features.Works.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Sanitation;
using sciencehub_backend_core.Shared.Validation;

namespace sciencehub_backend_core.Features.Works.Services
{
    public class WorkService : IWorkService
    {
        private readonly CoreServiceDbContext _context;
        private readonly ILogger<WorkService> _logger;
        private readonly IWorkUtilsService _workUtilsService;
        private readonly ISanitizerService _sanitizerService;
        private readonly IDatabaseValidation _databaseValidation;

        public WorkService(CoreServiceDbContext context, ILogger<WorkService> logger, IWorkUtilsService workUtilsService, ISanitizerService sanitizerService, IDatabaseValidation databaseValidation)
        {
            _context = context;
            _logger = logger;
            _workUtilsService = workUtilsService;
            _sanitizerService = sanitizerService;
            _databaseValidation = databaseValidation;
        }

        public async Task<WorkBase> CreateWorkAsync(CreateWorkDTO createWorkDTO)
        {
            // Use transaction
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var workTypeEnum = EnumParser.ParseWorkType(createWorkDTO.WorkType);
                if (!workTypeEnum.HasValue)
                {
                    _logger.LogWarning($"Invalid workType string: {createWorkDTO.WorkType}");
                    throw new InvalidWorkTypeException();
                }

                // Prepare and add work
                var work = _workUtilsService.CreateWorkType(createWorkDTO.WorkType);
                work.Title = _sanitizerService.Sanitize(createWorkDTO.Title);
                work.Description = _sanitizerService.Sanitize(createWorkDTO.Description);
                work.WorkType = workTypeEnum.Value;
                work.Public = createWorkDTO.Public;

                _context.Add(work);
                await _context.SaveChangesAsync();

                // Handle many-to-many with users
                await _workUtilsService.AddWorkUsersAsync(work.Id, createWorkDTO.Users, createWorkDTO.WorkType);

                // Generate an initial work version
                var initialWorkVersion = new WorkVersion
                {
                    WorkId = work.Id,
                    WorkType = workTypeEnum.Value,
                };
                _context.WorkVersions.Add(initialWorkVersion);
                await _context.SaveChangesAsync();

                // Update the work with the current work version ID
                work.CurrentWorkVersionId = initialWorkVersion.Id;
                _context.Update(work);
                await _context.SaveChangesAsync();

                // Handle project if provided
                if (createWorkDTO.ProjectId != null)
                {
                    // Rollback if submission ID is not also provided or not valid
                    _logger.LogInformation($"Project ID provided: {createWorkDTO.ProjectId}");
                    _logger.LogInformation($"Submission ID provided: {createWorkDTO.SubmissionId}");
                    var projectSubmissionId = await _databaseValidation.ValidateProjectSubmissionId(createWorkDTO.SubmissionId);

                    // Add work to project
                    await _workUtilsService.AddWorkProjectAsync(work.Id, createWorkDTO.ProjectId.Value, createWorkDTO.WorkType);

                    // Add work submission to project submission and create work versions graph
                    await AddWorkSubmissionAsync(work.Id, workTypeEnum.Value, initialWorkVersion.Id, createWorkDTO.SubmissionId, createWorkDTO.Users);

                }
                else
                {
                    // Add work versions graph with only one node = created initial version Id 
                    var workGraph = new WorkGraph
                    {
                        WorkId = work.Id,
                        WorkType = workTypeEnum.Value,
                        GraphData = new GraphData
                        {
                            {
                                initialWorkVersion.Id.ToString(), new GraphNode
                                {
                                    Neighbors = new List<string>(),
                                    IsSnapshot = true,
                                }
                            }
                        }
                    };
                    _context.WorkGraphs.Add(workGraph);
                    await _context.SaveChangesAsync();

                }

                // Commit transaction
                transaction.Commit();

                return work;
            }
            catch (Exception ex)
            {
                // Roll back transaction in case of an exception
                transaction.Rollback();
                _logger.LogError(ex, "An error occurred while creating the work.");
                throw;
            }
        }

        private async Task AddWorkSubmissionAsync(int workId, WorkType workTypeEnum, int initialWorkVersionId, int? submissionId, List<string> users)
        {
            // Generate a final work version
            var finalWorkVersion = new WorkVersion
            {
                WorkId = workId,
                WorkType = workTypeEnum,
            };
            _context.WorkVersions.Add(finalWorkVersion);
            await _context.SaveChangesAsync();

            var newWorkSubmission = new WorkSubmission
            {
                WorkId = workId,
                WorkType = workTypeEnum,
                InitialWorkVersionId = initialWorkVersionId,
                FinalWorkVersionId = finalWorkVersion.Id,
                Status = SubmissionStatus.InProgress, // Initial status
                Title = "Initial work submission",
                Public = false,
            };
            _context.WorkSubmissions.Add(newWorkSubmission);
            await _context.SaveChangesAsync();

            // Add work submission to project submission
            var projectSubmissionWorkSubmission = new ProjectWorkSubmission
            {
                ProjectSubmissionId = submissionId.Value,
                WorkSubmissionId = newWorkSubmission.Id,
            };
            _context.ProjectWorkSubmissions.Add(projectSubmissionWorkSubmission);
            await _context.SaveChangesAsync();

            //Create initial work version graph with two nodes = the initial and final version Id's created
            var workGraph = new WorkGraph
            {
                WorkId = workId,
                WorkType = workTypeEnum,
                GraphData = new GraphData
                {
                    {
                        initialWorkVersionId.ToString(), new GraphNode
                        {
                            Neighbors = new List<string> { finalWorkVersion.Id.ToString() },
                            IsSnapshot = true,
                        }
                    },
                    {
                        finalWorkVersion.Id.ToString(), new GraphNode
                        {
                            Neighbors = new List<string> { initialWorkVersionId.ToString() },
                            IsSnapshot = false,
                        }
                    }
                }
            };

            _context.WorkGraphs.Add(workGraph);
            await _context.SaveChangesAsync();

            // Add users to work submission (same as work users)
            await AddWorkSubmissionUsersAsync(users, newWorkSubmission.Id);
        }

        private async Task AddWorkSubmissionUsersAsync(List<string> users, int workSubmissionId)
        {
            // Add users to work submission -> same users as work
            foreach (var userIdString in users)
            {
                // Verify provided userId is valid UUID and exists in database
                var userId = await _databaseValidation.ValidateUserId(userIdString);

                // Add user
                _context.WorkSubmissionUsers.Add(new WorkSubmissionUser { UserId = userId, WorkSubmissionId = workSubmissionId });
            }
            await _context.SaveChangesAsync();
        }
    }
}
