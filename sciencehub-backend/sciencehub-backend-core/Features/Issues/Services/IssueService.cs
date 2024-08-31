using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Issues.Dto;
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

        public async Task<int> CreateIssueAsync(CreateIssueDto createIssueDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                int issueId = 0;
                
                switch (createIssueDto.IssueObjectType)
                {
                    case "Project":
                        var projectIssue = await CreateProjectIssueAsync(createIssueDto);
                        issueId = projectIssue.Id;
                        break;
                    case "Work":
                        var workIssue = await CreateWorkIssueAsync(createIssueDto);
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

        public async Task<ProjectIssue> CreateProjectIssueAsync(CreateIssueDto createIssueDto)
        {
            var projectId = await _databaseValidation.ValidateProjectId(createIssueDto.ProjectId);
            var newProjectIssue = new ProjectIssue
            {
                ProjectId = projectId,
                Title = _sanitizerService.Sanitize(createIssueDto.Title),
                Description = _sanitizerService.Sanitize(createIssueDto.Description),
                Public = createIssueDto.Public,
            };
            _context.ProjectIssues.Add(newProjectIssue);
            await _context.SaveChangesAsync();

            await AddUsersToIssueAsync(createIssueDto.Users, newProjectIssue.Id, "Project");
            return newProjectIssue;
        }

        public async Task<WorkIssue> CreateWorkIssueAsync(CreateIssueDto createIssueDto)
        {
            if (createIssueDto.WorkId == null)
            {
                throw new InvalidWorkIdException();
            }
            var workId = createIssueDto.WorkId.Value;
            var workTypeEnum = EnumParser.ParseWorkType(createIssueDto.WorkType);
            if (!workTypeEnum.HasValue)
            {
                throw new InvalidWorkTypeException();
            }

            var newWorkIssue = new WorkIssue
            {
                WorkId = workId,
                WorkType = workTypeEnum.Value,
                Title = _sanitizerService.Sanitize(createIssueDto.Title),
                Description = _sanitizerService.Sanitize(createIssueDto.Description),
                Public = createIssueDto.Public,
            };
            _context.WorkIssues.Add(newWorkIssue);
            await _context.SaveChangesAsync();

            await AddUsersToIssueAsync(createIssueDto.Users, newWorkIssue.Id, "Work");
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
    }
}