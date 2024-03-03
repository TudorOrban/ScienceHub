using sciencehub_backend.Data;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Features.Issues.Dto;
using sciencehub_backend.Features.Issues.Models;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Validation;

namespace sciencehub_backend.Features.Issues.Services
{
    public class IssueService : IIssueService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<IssueService> _logger;
        private readonly IDatabaseValidation _databaseValidation;

        public IssueService(AppDbContext context, ILogger<IssueService> logger, IDatabaseValidation databaseValidation)
        {
            _context = context;
            _logger = logger;
            _databaseValidation = databaseValidation;
        }

        public async Task<int> CreateIssueAsync(CreateIssueDto createIssueDto, SanitizerService sanitizerService)
        {
            // Use transaction
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Create project or work issue
                switch (createIssueDto.IssueObjectType)
                {
                    case "Project":
                        var projectId = await _databaseValidation.ValidateProjectId(createIssueDto.ProjectId);
                        // Create the project issue
                        var newProjectIssue = new ProjectIssue
                        {
                            ProjectId = projectId,
                            Title = sanitizerService.Sanitize(createIssueDto.Title),
                            Description = sanitizerService.Sanitize(createIssueDto.Description),
                            Public = createIssueDto.Public,
                        };
                        _context.ProjectIssues.Add(newProjectIssue);
                        await _context.SaveChangesAsync();

                        // Add the users to project issue
                        foreach (var userIdString in createIssueDto.Users)
                        {
                            // Verify provided userId is valid UUID and exists in database
                            var userId = await _databaseValidation.ValidateUserId(userIdString);
                            _logger.LogInformation($"Adding user {userId} to project issue {newProjectIssue.Id}");
                            _context.ProjectIssueUsers.Add(new ProjectIssueUser { ProjectIssueId = newProjectIssue.Id, UserId = userId });
                        }
                        await _context.SaveChangesAsync();

                        // Commit the transaction
                        transaction.Commit();

                        return newProjectIssue.Id;
                    case "Work":
                        // TODO: Add validation for (workId, workType)
                        var workId = createIssueDto.WorkId.Value;
                        var workTypeEnum = EnumParser.ParseWorkType(createIssueDto.WorkType);
                        if (!workTypeEnum.HasValue)
                        {
                            _logger.LogWarning($"Invalid workType string: {createIssueDto.WorkType}");
                            throw new InvalidWorkTypeException();
                        }
                        
                        // Create the work issue
                        var newWorkIssue = new WorkIssue
                        {
                            WorkId = workId,
                            WorkType = workTypeEnum.Value,
                            Title = sanitizerService.Sanitize(createIssueDto.Title),
                            Description = sanitizerService.Sanitize(createIssueDto.Description),
                            Public = createIssueDto.Public,
                        };
                        _context.WorkIssues.Add(newWorkIssue);
                        await _context.SaveChangesAsync();

                        // Add the users to work issue
                        foreach (var userIdString in createIssueDto.Users)
                        {
                            // Verify provided userId is valid UUID and exists in database
                            var userId = await _databaseValidation.ValidateUserId(userIdString);
                            _logger.LogInformation($"Adding user {userId} to work issue {newWorkIssue.Id}");
                            _context.WorkIssueUsers.Add(new WorkIssueUser { WorkIssueId = newWorkIssue.Id, UserId = userId });
                        }
                        await _context.SaveChangesAsync();

                        // Commit the transaction
                        transaction.Commit();

                        return newWorkIssue.Id;
                }
                return 0;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError(ex, "Error creating issue.");
                throw;
            }
        }
    }
}