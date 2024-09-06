using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Works.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Works.Repositories
{
    public class WorkRepository : IWorkRepository
    {
        private readonly CoreServiceDbContext _context;

        public WorkRepository(CoreServiceDbContext context)
        {
            _context = context;
        }

        public async Task<Work> GetWorkAsync(int workId)
        {
            return await _context.Works.FindAsync(workId)
                ?? throw new ResourceNotFoundException($"Work", workId.ToString());
        }

        public async Task<IEnumerable<Work>> GetWorksByProjectIdAsync(int projectId)
        {
            return await _context.ProjectWorks
                .Where(pw => pw.ProjectId == projectId)
                .Select(pw => pw.Work)
                .Where(pw => pw != null)
                .ToListAsync();
        }

        public async Task<IEnumerable<Work>> GetWorksByUserIdAsync(Guid userId)
        {
            return await _context.WorkUsers
                .Where(wu => wu.UserId == userId)
                .Select(wu => wu.Work)
                .Where(w => w != null)
                .ToListAsync();
        }

        public async Task<IEnumerable<Work>> GetWorksByTypeAndUserIdAsync(WorkType workType, Guid userId)
        {
            return await _context.WorkUsers
                .Where(wu => wu.UserId == userId)
                .Select(wu => wu.Work)
                .Where(w => w != null && w.WorkType == workType)
                .ToListAsync();
        }

        public async Task<IEnumerable<Work>> GetWorksByTypeAndProjectIdAsync(WorkType workType, int projectId)
        {
            return await _context.ProjectWorks
                .Where(pw => pw.ProjectId == projectId)
                .Select(pw => pw.Work)
                .Where(w => w != null && w.WorkType == workType)
                .ToListAsync();
        }

        public async Task<PaginatedResults<Work>> SearchWorksByTypeAndUserIdAsync(Guid userId, WorkType workType, SearchParams searchParams)
        {
            var query = _context.WorkUsers
                .Where(wu => wu.UserId == userId)
                .Select(wu => wu.Work)
                .Where(w => w != null && w.WorkType == workType);

            if (!string.IsNullOrEmpty(searchParams.SearchQuery))
            {
                query = query.Where(w => w.Title.Contains(searchParams.SearchQuery));
            }

            query = ApplySorting(query, searchParams.SortBy, searchParams.SortDescending);

            var totalItemCount = await query.CountAsync();

            var works = await query
                .Skip(((searchParams.Page ?? 1) - 1) * (searchParams.ItemsPerPage ?? 10))
                .Take(searchParams.ItemsPerPage ?? 10)
                .ToListAsync();

            return new PaginatedResults<Work>
            {
                Results = works,
                TotalCount = totalItemCount
            };
        }
        
        private IQueryable<Work> ApplySorting(IQueryable<Work> query, string? sortBy, bool descending)
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
        
        public async Task<Work> CreateWorkAsync(Work work)
        {
            _context.Works.Add(work);
            await _context.SaveChangesAsync();
            return work;
        }

        public async Task<Work> UpdateWorkAsync(Work work)
        {
            _context.Works.Update(work);
            await _context.SaveChangesAsync();
            return work;
        }
        
        public async Task DeleteWorkAsync(int workId)
        {
            var work = await GetWorkAsync(workId);
            _context.Works.Remove(work);
            await _context.SaveChangesAsync();
        }
    }
}