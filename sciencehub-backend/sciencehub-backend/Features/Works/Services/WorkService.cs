using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Data;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Works.Dto;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Features.Works.Models.ProjectWorks;
using sciencehub_backend.Features.Works.Models.WorkUsers;
using sciencehub_backend.Shared.Enums;
using System.Reflection;

namespace sciencehub_backend.Features.Works.Services
{
    public class WorkService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<WorkService> _logger;

        public WorkService(AppDbContext context, ILogger<WorkService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<WorkBase> CreateWorkAsync(CreateWorkDto createWorkDto, SanitizerService sanitizerService)
        {
            // Use transaction
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var workTypeEnum = ParseWorkType(createWorkDto.WorkType);
                if (workTypeEnum == null)
                {
                    _logger.LogWarning($"Invalid workType string: {createWorkDto.WorkType}");
                    throw new InvalidWorkTypeException();
                }

                // Prepare and add work
                var work = CreateWorkType(createWorkDto.WorkType);
                work.Title = sanitizerService.Sanitize(createWorkDto.Title);
                work.Description = sanitizerService.Sanitize(createWorkDto.Description);
                work.Public = createWorkDto.Public;

                _context.Add(work);
                await _context.SaveChangesAsync();

                // Handle many-to-many with users
                await AddWorkUsersAsync(work.Id, createWorkDto.Users, createWorkDto.WorkType);

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

                // Create initial work version graph with a single node = initial work version ID
                var workGraph = new WorkGraph
                {
                    WorkId = work.Id,
                    WorkType = workTypeEnum.Value,
                    GraphDataParsed = new Dictionary<string, GraphNode>
                    {
                        {
                            initialWorkVersion.Id.ToString(), new GraphNode
                            {
                                Neighbors = new List<string>(),
                                IsSnapshot = false,
                            }
                        }
                    }
                };
                _context.WorkGraphs.Add(workGraph);
                await _context.SaveChangesAsync();

                // Handle project if provided
                if (createWorkDto.ProjectId != null)
                {
                    // Exit early if submission ID is not also provided
                    if (createWorkDto.SubmissionId == null)
                    {
                        throw new InvalidSubmissionIdException();
                    }

                    // Add work to project
                    await AddWorkProjectAsync(work.Id, createWorkDto.ProjectId.Value, createWorkDto.WorkType);

                    // Add work submission to project submission
                    //await AddWorkSubmissionAsync(work.Id, workTypeEnum, initialWorkVersion.Id, createWorkDto.SubmissionId);
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

        // Parse work type enum
        public static WorkType? ParseWorkType(string workTypeString)
        {
            foreach (WorkType workType in Enum.GetValues(typeof(WorkType)))
            {
                var field = typeof(WorkType).GetField(workType.ToString());
                var attribute = field.GetCustomAttribute<EnumDescriptionAttribute>();
                if (attribute != null && attribute.Description == workTypeString)
                {
                    return workType;
                }
            }

            return null;
        }


        // Help ER find the appropriate database table
        private WorkBase CreateWorkType(string workType)
        {
            return workType switch
            {
                "Paper" => new Paper(),
                "Experiment" => new Experiment(),
                "Dataset" => new Dataset(),
                "Data Analysis" => new DataAnalysis(),
                "AI Model" => new AIModel(),
                "Code Block" => new CodeBlock(),
                _ => throw new InvalidWorkTypeException()
            };
        }

        // Verify and add each user to the corresponding work
        private async Task AddWorkUsersAsync(int workId, List<string> userIds, string workType)
        {
            foreach (var userIdString in userIds)
            {
                if (!Guid.TryParse(userIdString, out var userId))
                {
                    throw new InvalidUserIdException();
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    throw new InvalidUserIdException();
                }

                switch (workType)
                {
                    case "Paper":
                        _context.PaperUsers.Add(new PaperUser { PaperId = workId, UserId = userId });
                        break;
                    case "Experiment":
                        _context.ExperimentUsers.Add(new ExperimentUser { ExperimentId = workId, UserId = userId });
                        break;
                    case "Dataset":
                        _context.DatasetUsers.Add(new DatasetUser { DatasetId = workId, UserId = userId });
                        break;
                    case "Data Analysis":
                        _context.DataAnalysisUsers.Add(new DataAnalysisUser { DataAnalysisId = workId, UserId = userId });
                        break;
                    case "AI Model":
                        _context.AIModelUsers.Add(new AIModelUser { AIModelId = workId, UserId = userId });
                        break;
                    case "Code Block":
                        _context.CodeBlockUsers.Add(new CodeBlockUser { CodeBlockId = workId, UserId = userId });
                        break;
                }
            }

            await _context.SaveChangesAsync();
        }

        // Verify and add project to work
        private async Task AddWorkProjectAsync(int workId, int projectId, string workType)
        {
            var projectExists = await _context.Projects.AnyAsync(p => p.Id == projectId);
            if (!projectExists)
            {
                throw new InvalidProjectIdException();
            }

            switch (workType)
            {
                case "Paper":
                    _context.ProjectPapers.Add(new ProjectPaper { PaperId = workId, ProjectId = projectId });
                    break;
                case "Experiment":
                    _context.ProjectExperiments.Add(new ProjectExperiment { ExperimentId = workId, ProjectId = projectId });
                    break;
                case "Dataset":
                    _context.ProjectDatasets.Add(new ProjectDataset { DatasetId = workId, ProjectId = projectId });
                    break;
                case "Data Analysis":
                    _context.ProjectDataAnalyses.Add(new ProjectDataAnalysis { DataAnalysisId = workId, ProjectId = projectId });
                    break;
                case "AI Model":
                    _context.ProjectAIModels.Add(new ProjectAIModel { AIModelId = workId, ProjectId = projectId });
                    break;
                case "Code Block":
                    _context.ProjectCodeBlocks.Add(new ProjectCodeBlock { CodeBlockId = workId, ProjectId = projectId });
                    break;
            }

            await _context.SaveChangesAsync();
        }

        private async Task AddWorkSubmissionAsync(int workId, WorkType workTypeEnum, int initialWorkVersionId, int? submissionId)
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
                Status = Shared.Enums.SubmissionStatus.InProgress, // Initial status
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
        }
    }
}
