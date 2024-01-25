using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Data;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Features.Works.Dto;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Validation;

namespace sciencehub_backend.Features.Works.Services
{
    public class WorkService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<WorkService> _logger;
        private readonly DatabaseValidation _databaseValidation;
        private readonly WorkUtilsService _workUtilsService;

        public WorkService(AppDbContext context, ILogger<WorkService> logger)
        {
            _context = context;
            _logger = logger;
            _databaseValidation = new DatabaseValidation(context);
            _workUtilsService = new WorkUtilsService(_context);
        }

        public async Task<WorkBase> CreateWorkAsync(CreateWorkDto createWorkDto, SanitizerService sanitizerService)
        {
            // Use transaction
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var workTypeEnum = EnumParser.ParseWorkType(createWorkDto.WorkType);
                if (!workTypeEnum.HasValue)
                {
                    _logger.LogWarning($"Invalid workType string: {createWorkDto.WorkType}");
                    throw new InvalidWorkTypeException();
                }

                // Prepare and add work
                var work = _workUtilsService.CreateWorkType(createWorkDto.WorkType);
                work.Title = sanitizerService.Sanitize(createWorkDto.Title);
                work.Description = sanitizerService.Sanitize(createWorkDto.Description);
                work.WorkType = workTypeEnum.Value.ToString();
                work.Public = createWorkDto.Public;

                _context.Add(work);
                await _context.SaveChangesAsync();

                // Handle many-to-many with users
                await _workUtilsService.AddWorkUsersAsync(work.Id, createWorkDto.Users, createWorkDto.WorkType);

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
                if (createWorkDto.ProjectId != null)
                {
                    // Rollback if submission ID is not also provided or not valid
                    _logger.LogInformation($"Project ID provided: {createWorkDto.ProjectId}");
                    _logger.LogInformation($"Submission ID provided: {createWorkDto.SubmissionId}");
                    var projectSubmissionId = await _databaseValidation.ValidateProjectSubmissionId(createWorkDto.SubmissionId);

                    // Add work to project
                    await _workUtilsService.AddWorkProjectAsync(work.Id, createWorkDto.ProjectId.Value, createWorkDto.WorkType);

                    // Add work submission to project submission and create work versions graph
                    await AddWorkSubmissionAsync(work.Id, workTypeEnum.Value, initialWorkVersion.Id, createWorkDto.SubmissionId, createWorkDto.Users);

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
