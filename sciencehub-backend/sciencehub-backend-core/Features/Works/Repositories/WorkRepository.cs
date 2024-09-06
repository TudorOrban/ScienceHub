using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Works.Models;
using sciencehub_backend_core.Shared.Enums;

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

        public async Task<IEnumerable<Work>> GetWorksByTypeAndUserIdAsync(WorkType type, Guid userId)
        {
            return await _context.WorkUsers
                .Where(wu => wu.UserId == userId)
                .Select(wu => wu.Work)
                .Where(w => w != null && w.WorkType == type)
                .ToListAsync();
        }

        public async Task<IEnumerable<Work>> GetWorksByTypeAndProjectIdAsync(WorkType type, int projectId)
        {
            return await _context.ProjectWorks
                .Where(pw => pw.ProjectId == projectId)
                .Select(pw => pw.Work)
                .Where(w => w != null && w.WorkType == type)
                .ToListAsync();
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