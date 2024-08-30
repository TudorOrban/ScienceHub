using sciencehub_backend.Data;
using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Shared.Search;
using Microsoft.EntityFrameworkCore;

namespace sciencehub_backend.Features.Projects.Repositories 
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly AppDbContext _context;

        public ProjectRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResults<Project>> GetProjectsByUserIdAsync(Guid userId, string searchTerm, int page, int pageSize, string sortBy, bool sortDescending)
        {
            IQueryable<Project> query = _context.Projects
                .Where(p => p.ProjectUsers.Any(pu => pu.UserId == userId));

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(p => p.Name.Contains(searchTerm) || p.Title.Contains(searchTerm));
            }

            query = ApplySorting(query, sortBy, sortDescending);

            var totalItemCount = await query.CountAsync();
            var projects = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(p => p.ProjectUsers)
                    .ThenInclude(pu => pu.User)
                .ToListAsync();

            return new PaginatedResults<Project>
            {
                Results = projects,
                TotalCount = totalItemCount
            };
        }
        
        private IQueryable<Project> ApplySorting(IQueryable<Project> query, string sortBy, bool descending)
        {
            switch (sortBy)
            {
                case "Name":
                    query = descending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name);
                    break;
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