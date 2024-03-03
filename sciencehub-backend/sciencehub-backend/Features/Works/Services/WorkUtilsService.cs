using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Data;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Features.Works.Models.ProjectWorks;
using sciencehub_backend.Features.Works.Models.WorkUsers;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Validation;

namespace sciencehub_backend.Features.Works.Services
{
    public class WorkUtilsService : IWorkUtilsService
    {
        private readonly AppDbContext _context;
        private readonly IDatabaseValidation _databaseValidation;

        public WorkUtilsService(AppDbContext context, IDatabaseValidation databaseValidation)
        {
            _context = context;
            _databaseValidation = databaseValidation;
        }

        // Util: fetch work and associated users based on (workId, workType)
        public virtual async Task<(WorkBase work, IEnumerable<WorkUserDto> workUsers)> GetWorkAsync(int workId, WorkType workType)
        {
            WorkBase work;
            IEnumerable<WorkUserDto> workUsers;

            switch (workType)
            {
                case WorkType.Paper:
                    work = await _context.Papers.Include(p => p.PaperUsers).ThenInclude(pu => pu.User).SingleOrDefaultAsync(w => w.Id == workId);
                    workUsers = work != null ? ((Paper)work).PaperUsers.Select(pu => new WorkUserDto
                    {
                        UserId = pu.UserId,
                        Role = pu.Role,
                        Username = pu.User.Username,
                        FullName = pu.User.FullName
                    }) : Enumerable.Empty<WorkUserDto>();
                    break;

                case WorkType.Experiment:
                    work = await _context.Experiments.Include(e => e.ExperimentUsers).ThenInclude(eu => eu.User).SingleOrDefaultAsync(w => w.Id == workId);
                    workUsers = work != null ? ((Experiment)work).ExperimentUsers.Select(eu => new WorkUserDto
                    {
                        UserId = eu.UserId,
                        Role = eu.Role,
                        Username = eu.User.Username,
                        FullName = eu.User.FullName
                    }) : Enumerable.Empty<WorkUserDto>();
                    break;

                case WorkType.Dataset:
                    work = await _context.Datasets.Include(d => d.DatasetUsers).ThenInclude(du => du.User).SingleOrDefaultAsync(w => w.Id == workId);
                    workUsers = work != null ? ((Dataset)work).DatasetUsers.Select(du => new WorkUserDto
                    {
                        UserId = du.UserId,
                        Role = du.Role,
                        Username = du.User.Username,
                        FullName = du.User.FullName
                    }) : Enumerable.Empty<WorkUserDto>();
                    break;

                case WorkType.DataAnalysis:
                    work = await _context.DataAnalyses.Include(da => da.DataAnalysisUsers).ThenInclude(dau => dau.User).SingleOrDefaultAsync(w => w.Id == workId);
                    workUsers = work != null ? ((DataAnalysis)work).DataAnalysisUsers.Select(dau => new WorkUserDto
                    {
                        UserId = dau.UserId,
                        Role = dau.Role,
                        Username = dau.User.Username,
                        FullName = dau.User.FullName
                    }) : Enumerable.Empty<WorkUserDto>();
                    break;

                case WorkType.AIModel:
                    work = await _context.AIModels.Include(am => am.AIModelUsers).ThenInclude(amu => amu.User).SingleOrDefaultAsync(w => w.Id == workId);
                    workUsers = work != null ? ((AIModel)work).AIModelUsers.Select(amu => new WorkUserDto
                    {
                        UserId = amu.UserId,
                        Role = amu.Role,
                        Username = amu.User.Username,
                        FullName = amu.User.FullName
                    }) : Enumerable.Empty<WorkUserDto>();
                    break;

                case WorkType.CodeBlock:
                    work = await _context.CodeBlocks.Include(cb => cb.CodeBlockUsers).ThenInclude(cbu => cbu.User).SingleOrDefaultAsync(w => w.Id == workId);
                    workUsers = work != null ? ((CodeBlock)work).CodeBlockUsers.Select(cbu => new WorkUserDto
                    {
                        UserId = cbu.UserId,
                        Role = cbu.Role,
                        Username = cbu.User.Username,
                        FullName = cbu.User.FullName
                    }) : Enumerable.Empty<WorkUserDto>();
                    break;

                default:
                    throw new InvalidWorkTypeException();
            }

            if (work == null)
            {
                throw new Exception("Work not found.");
            }

            return (work, workUsers);
        }

        // Help ER find the appropriate database table
        public WorkBase CreateWorkType(string workType)
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
        public async Task AddWorkUsersAsync(int workId, List<string> userIds, string workType)
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
        public async Task AddWorkProjectAsync(int workId, int projId, string workType)
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
    }
}