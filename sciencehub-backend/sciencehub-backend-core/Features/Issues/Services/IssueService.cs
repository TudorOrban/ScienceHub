using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Issues.DTOs;
using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Sanitation;
using sciencehub_backend_core.Shared.Validation;

namespace sciencehub_backend_core.Features.Issues.Services
{
    public class IssueService : IIssueService
    {
        private readonly CoreServiceDbContext _context;
        private readonly ILogger<IssueService> _logger;
        private readonly ISanitizerService _sanitizerService;
        private readonly IDatabaseValidation _databaseValidation;

        public IssueService(CoreServiceDbContext context, ILogger<IssueService> logger, ISanitizerService sanitizerService, IDatabaseValidation databaseValidation)
        {
            _context = context;
            _logger = logger;
            _sanitizerService = sanitizerService;
            _databaseValidation = databaseValidation;
        }

        public async Task<List<ProjectIssue>> GetProjectIssuesByProjectIdAsync(int projectId)
        {
            return await _context.ProjectIssues.Where(pi => pi.ProjectId == projectId).ToListAsync();
        }

        public async Task<List<WorkIssue>> GetWorkIssuesByWorkIdAsync(int workId)
        {
            return await _context.WorkIssues.Where(wi => wi.WorkId == workId).ToListAsync();
        }

        public async Task<int> CreateIssueAsync(CreateIssueDTO createIssueDTO)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                int issueId = 0;
                
                switch (createIssueDTO.IssueObjectType)
                {
                    case "Project":
                        var projectIssue = await CreateProjectIssueAsync(createIssueDTO);
                        issueId = projectIssue.Id;
                        break;
                    case "Work":
                        var workIssue = await CreateWorkIssueAsync(createIssueDTO);
                        issueId = workIssue.Id;
                        break;
                    default:
                        throw new ArgumentException("Invalid IssueObjectType");
                }

                transaction.Commit();
                return issueId;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError(ex, "Error creating issue.");
                throw;
            }
        }

        public async Task<ProjectIssue> CreateProjectIssueAsync(CreateIssueDTO createIssueDTO)
        {
            var projectId = await _databaseValidation.ValidateProjectId(createIssueDTO.ProjectId);
            var newProjectIssue = new ProjectIssue
            {
                ProjectId = projectId,
                Title = _sanitizerService.Sanitize(createIssueDTO.Title),
                Description = _sanitizerService.Sanitize(createIssueDTO.Description),
                Public = createIssueDTO.Public,
            };
            _context.ProjectIssues.Add(newProjectIssue);
            await _context.SaveChangesAsync();

            await AddUsersToIssueAsync(createIssueDTO.Users, newProjectIssue.Id, "Project");
            return newProjectIssue;
        }

        public async Task<WorkIssue> CreateWorkIssueAsync(CreateIssueDTO createIssueDTO)
        {
            if (createIssueDTO.WorkId == null)
            {
                throw new InvalidWorkIdException();
            }
            var workId = createIssueDTO.WorkId.Value;
            var workTypeEnum = EnumParser.ParseWorkType(createIssueDTO.WorkType);
            if (!workTypeEnum.HasValue)
            {
                throw new InvalidWorkTypeException();
            }

            var newWorkIssue = new WorkIssue
            {
                WorkId = workId,
                WorkType = workTypeEnum.Value,
                Title = _sanitizerService.Sanitize(createIssueDTO.Title),
                Description = _sanitizerService.Sanitize(createIssueDTO.Description),
                Public = createIssueDTO.Public,
            };
            _context.WorkIssues.Add(newWorkIssue);
            await _context.SaveChangesAsync();

            await AddUsersToIssueAsync(createIssueDTO.Users, newWorkIssue.Id, "Work");
            return newWorkIssue;
        }

        private async Task AddUsersToIssueAsync(IEnumerable<string> userIdStrings, int issueId, string issueType)
        {
            foreach (var userIdString in userIdStrings)
            {
                var userId = await _databaseValidation.ValidateUserId(userIdString);
                _logger.LogInformation($"Adding user {userId} to {issueType.ToLower()} issue {issueId}");

                if (issueType == "Project")
                {
                    _context.ProjectIssueUsers.Add(new ProjectIssueUser { ProjectIssueId = issueId, UserId = userId });
                }
                else if (issueType == "Work")
                {
                    _context.WorkIssueUsers.Add(new WorkIssueUser { WorkIssueId = issueId, UserId = userId });
                }
            }
            await _context.SaveChangesAsync();
        }

        public async Task<int> UpdateIssueAsync(UpdateIssueDTO updateIssueDTO)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                switch (updateIssueDTO.IssueObjectType)
                {
                    case "Project":
                        await UpdateProjectIssueAsync(updateIssueDTO);
                        break;
                    case "Work":
                        await UpdateWorkIssueAsync(updateIssueDTO);
                        break;
                    default:
                        throw new ArgumentException("Invalid IssueObjectType");
                }

                transaction.Commit();
                return updateIssueDTO.Id;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError(ex, "Error updating issue.");
                throw;
            }
        }

        public async Task<ProjectIssue> UpdateProjectIssueAsync(UpdateIssueDTO updateIssueDTO)
        {
            var projectIssue = await _context.ProjectIssues.FindAsync(updateIssueDTO.Id);
            if (projectIssue == null)
            {
                throw new InvalidProjectIssueIdException();
            }

            projectIssue.Title = _sanitizerService.Sanitize(updateIssueDTO.Title);
            projectIssue.Description = _sanitizerService.Sanitize(updateIssueDTO.Description);
            projectIssue.Public = updateIssueDTO.Public;
            await _context.SaveChangesAsync();

            return projectIssue;
        }

        public async Task<WorkIssue> UpdateWorkIssueAsync(UpdateIssueDTO updateIssueDTO)
        {
            var workIssue = await _context.WorkIssues.FindAsync(updateIssueDTO.Id);
            if (workIssue == null)
            {
                throw new InvalidWorkIssueIdException();
            }

            workIssue.Title = _sanitizerService.Sanitize(updateIssueDTO.Title);
            workIssue.Description = _sanitizerService.Sanitize(updateIssueDTO.Description);
            workIssue.Public = updateIssueDTO.Public;
            await _context.SaveChangesAsync();

            return workIssue;
        }

        public async Task<int> DeleteIssueAsync(int issueId, string issueType)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                switch (issueType)
                {
                    case "Project":
                        await DeleteProjectIssueAsync(issueId);
                        break;
                    case "Work":
                        await DeleteWorkIssueAsync(issueId);
                        break;
                    default:
                        throw new ArgumentException("Invalid IssueObjectType");
                }

                transaction.Commit();
                return issueId;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError(ex, "Error deleting issue.");
                throw;
            }
        }

        public async Task DeleteProjectIssueAsync(int issueId)
        {
            var projectIssue = await _context.ProjectIssues.FindAsync(issueId);
            if (projectIssue == null)
            {
                throw new InvalidProjectIssueIdException();
            }

            _context.ProjectIssues.Remove(projectIssue);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteWorkIssueAsync(int issueId)
        {
            var workIssue = await _context.WorkIssues.FindAsync(issueId);
            if (workIssue == null)
            {
                throw new InvalidWorkIssueIdException();
            }

            _context.WorkIssues.Remove(workIssue);
            await _context.SaveChangesAsync();
        }
    }
}