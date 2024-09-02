using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Issues.Repositories
{
    public class ProjectIssueRepository : IProjectIssueRepository
    {
        private readonly CoreServiceDbContext _context;

        public ProjectIssueRepository(CoreServiceDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResults<ProjectIssue>> SearchProjectIssuesByProjectIdAsync(int projectId, SearchParams searchParams)
        {
            var query = _context.ProjectIssues
                .Where(pr => pr.ProjectId == projectId);

            if (!string.IsNullOrEmpty(searchParams.SearchQuery))
            {
                query = query.Where(pr => pr.Title.Contains(searchParams.SearchQuery));
            }

            query = ApplySorting(query, searchParams.SortBy, searchParams.SortDescending);

            var totalItemCount = await query.CountAsync();

            var projectIssues = await query
                .Skip(((searchParams.Page ?? 1) - 1) * (searchParams.ItemsPerPage ?? 10))
                .Take(searchParams.ItemsPerPage ?? 10)
                .ToListAsync();

            return new PaginatedResults<ProjectIssue>
            {
                Results = projectIssues,
                TotalCount = totalItemCount
            };
        }
        
        private IQueryable<ProjectIssue> ApplySorting(IQueryable<ProjectIssue> query, string? sortBy, bool descending)
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
    }
}