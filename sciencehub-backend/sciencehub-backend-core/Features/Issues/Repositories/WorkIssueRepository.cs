using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Issues.Repositories
{
    public class WorkIssueRepository : IWorkIssueRepository
    {
        private readonly CoreServiceDbContext _context;

        public WorkIssueRepository(CoreServiceDbContext context)
        {
            _context = context;
        }

        public async Task<WorkIssue> FindWorkIssueByIdAsync(int issueId)
        {
            var issue = await _context.WorkIssues.FindAsync(issueId);
            if (issue == null)
            {
                throw new InvalidWorkIssueIdException();
            }

            return issue;
        }

        // Search
        public async Task<PaginatedResults<WorkIssue>> SearchWorkIssuesByWorkIdAsync(int workId, WorkType workType, SearchParams searchParams)
        {
            var query = _context.WorkIssues
                .Where(pr => pr.WorkId == workId && pr.WorkType == workType);

            if (!string.IsNullOrEmpty(searchParams.SearchQuery))
            {
                query = query.Where(pr => pr.Title.Contains(searchParams.SearchQuery));
            }

            query = ApplySorting(query, searchParams.SortBy, searchParams.SortDescending);

            var totalItemCount = await query.CountAsync();

            var workIssues = await query
                .Skip(((searchParams.Page ?? 1) - 1) * (searchParams.ItemsPerPage ?? 10))
                .Take(searchParams.ItemsPerPage ?? 10)
                .ToListAsync();

            return new PaginatedResults<WorkIssue>
            {
                Results = workIssues,
                TotalCount = totalItemCount
            };
        }
        
        private IQueryable<WorkIssue> ApplySorting(IQueryable<WorkIssue> query, string? sortBy, bool descending)
        {
            switch (sortBy)
            {
                case "Title":
                    query = descending ? query.OrderByDescending(p => p.Title) : query.OrderBy(p => p.Title);
                    break;
                case "createdAt":
                    query = descending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt);
                    break;
                default:
                    throw new ArgumentException("Invalid sort field", nameof(sortBy));
            }
            return query;
        }

        public async Task<List<WorkIssue>> FindWorkIssuesByWorkIdAsync(int workId, WorkType workType)
        {
            return await _context.WorkIssues.Where(pr => pr.WorkId == workId && pr.WorkType == workType).ToListAsync();
        }

        // Create
        public async Task<WorkIssue> CreateWorkIssueAsync(WorkIssue newWorkIssue, IEnumerable<string> userIdStrings)
        {
            _context.WorkIssues.Add(newWorkIssue);
            await _context.SaveChangesAsync();

            await AddUsersToIssueAsync(userIdStrings, newWorkIssue.Id);

            return newWorkIssue;
        }

        private async Task AddUsersToIssueAsync(IEnumerable<string> userIdStrings, int issueId)
        {
            foreach (var userIdString in userIdStrings)
            {
                if (!Guid.TryParse(userIdString, out var userId))
                {
                    return;
                }
                _context.WorkIssueUsers.Add(new WorkIssueUser { WorkIssueId = issueId, UserId = userId });
            }
            await _context.SaveChangesAsync();
        }

        // Update
        public async Task<WorkIssue> UpdateWorkIssueAsync(WorkIssue workIssue)
        {
            _context.WorkIssues.Update(workIssue);
            await _context.SaveChangesAsync();

            return workIssue;
        }

        // Delete
        public async Task<int> DeleteWorkIssueAsync(int issueId)
        {
            var issue = await FindWorkIssueByIdAsync(issueId);
            _context.WorkIssues.Remove(issue);
            return await _context.SaveChangesAsync();
        }
    }
}