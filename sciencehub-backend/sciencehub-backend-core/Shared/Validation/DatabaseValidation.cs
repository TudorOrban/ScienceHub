using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Shared.Validation
{
    public class DatabaseValidation : IDatabaseValidation
    {
        private readonly CoreServiceDbContext _context;

        public DatabaseValidation(CoreServiceDbContext context)
        {
            _context = context;
        }


        // Validation of user id
        public async Task<Guid> ValidateUserId(string userIdString)
        {
            if (!Guid.TryParse(userIdString, out var userId))
            {
                throw new InvalidUserIdException();
            }

            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                throw new InvalidUserIdException();
            }

            return userId;
        }

        public async Task<int> ValidateProjectId(int? projectId)
        {
            if (!projectId.HasValue)
            {
                throw new InvalidProjectIdException();
            }

            var projectExists = await _context.Projects.AnyAsync(p => p.Id == projectId);
            if (!projectExists)
            {
                throw new InvalidProjectIdException();
            }

            return projectId.Value;
        }

        public async Task<int> ValidateProjectSubmissionId(int? projectSubmissionId)
        {
            if (!projectSubmissionId.HasValue)
            {
                throw new InvalidSubmissionIdException();
            }

            var projectSubmissionExists = await _context.ProjectSubmissions.AnyAsync(ps => ps.Id == projectSubmissionId);
            if (!projectSubmissionExists)
            {
                throw new InvalidSubmissionIdException();
            }

            return projectSubmissionId.Value;
        }

        public async Task<int> ValidateProjectVersionId(int? projectVersionId)
        {
            if (!projectVersionId.HasValue)
            {
                throw new InvalidProjectVersionIdException();
            }

            var projectVersionExists = await _context.ProjectVersions.AnyAsync(pv => pv.Id == projectVersionId);
            if (!projectVersionExists)
            {
                throw new InvalidProjectVersionIdException();
            }

            return projectVersionId.Value;
        }

        public async Task<int> ValidateWorkVersionId(int? workVersionId, WorkType workType)
        {
            if (!workVersionId.HasValue)
            {
                throw new InvalidWorkVersionIdException();
            }

            var workVersionExists = await _context.WorkVersions.AnyAsync(wv => wv.Id == workVersionId.Value && wv.WorkType == workType);
            if (!workVersionExists)
            {
                throw new InvalidWorkVersionIdException();
            }

            return workVersionId.Value;
        }

        public async Task<int> ValidateProjectIssueId(int? projectIssueId)
        {
            if (!projectIssueId.HasValue)
            {
                throw new InvalidProjectIssueIdException();
            }

            var projectIssueExists = await _context.ProjectIssues.AnyAsync(pi => pi.Id == projectIssueId);
            if (!projectIssueExists)
            {
                throw new InvalidProjectIssueIdException();
            }

            return projectIssueId.Value;
        }

        public async Task<int> ValidateWorkIssueId(int? workIssueId)
        {
            if (!workIssueId.HasValue)
            {
                throw new InvalidWorkIssueIdException();
            }

            var workIssueExists = await _context.WorkIssues.AnyAsync(wi => wi.Id == workIssueId);
            if (!workIssueExists)
            {
                throw new InvalidWorkIssueIdException();
            }

            return workIssueId.Value;
        }

    }
}