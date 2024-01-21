using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Data;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Works.Dto;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Features.Works.Models.ProjectWorks;
using sciencehub_backend.Features.Works.Models.WorkUsers;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Validation;
using GraphNode = sciencehub_backend.Features.Works.Models.GraphNode;

namespace sciencehub_backend.Features.Works.Services
{
    public class WorkService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<WorkService> _logger;
        private readonly DatabaseValidation _databaseValidation;

        public WorkService(AppDbContext context, ILogger<WorkService> logger)
        {
            _context = context;
            _logger = logger;
            _databaseValidation = new DatabaseValidation(context);
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
                var work = CreateWorkType(createWorkDto.WorkType);
                work.Title = sanitizerService.Sanitize(createWorkDto.Title);
                work.Description = sanitizerService.Sanitize(createWorkDto.Description);
                work.WorkType = createWorkDto.WorkType;
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

                // Handle project if provided
                if (createWorkDto.ProjectId != null)
                {
                    // Rollback if submission ID is not also provided or not valid
                    var projectSubmissionId = await _databaseValidation.ValidateProjectSubmissionId(createWorkDto.SubmissionId);

                    // Add work to project
                    await AddWorkProjectAsync(work.Id, createWorkDto.ProjectId.Value, createWorkDto.WorkType);

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
                        GraphDataParsed = new Dictionary<string, GraphNode>
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
                var userId = await _databaseValidation.ValidateUserId(userIdString);

                switch (workType)
                {
                    case "Paper":
                        _context.PaperUsers.Add(new PaperUser { PaperId = workId, UserId = userId, Role = "Main Author" });
                        break;
                    case "Experiment":
                        _context.ExperimentUsers.Add(new ExperimentUser { ExperimentId = workId, UserId = userId, Role = "Main Author" });
                        break;
                    case "Dataset":
                        _context.DatasetUsers.Add(new DatasetUser { DatasetId = workId, UserId = userId, Role = "Main Author" });
                        break;
                    case "Data Analysis":
                        _context.DataAnalysisUsers.Add(new DataAnalysisUser { DataAnalysisId = workId, UserId = userId, Role = "Main Author" });
                        break;
                    case "AI Model":
                        _context.AIModelUsers.Add(new AIModelUser { AIModelId = workId, UserId = userId, Role = "Main Author" });
                        break;
                    case "Code Block":
                        _context.CodeBlockUsers.Add(new CodeBlockUser { CodeBlockId = workId, UserId = userId, Role = "Main Author" });
                        break;
                }
            }

            await _context.SaveChangesAsync();
        }

        // Verify and add project to work
        private async Task AddWorkProjectAsync(int workId, int projId, string workType)
        {
            var projectId = await _databaseValidation.ValidateProjectId(projId);

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
                GraphDataParsed = new Dictionary<string, GraphNode>
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
