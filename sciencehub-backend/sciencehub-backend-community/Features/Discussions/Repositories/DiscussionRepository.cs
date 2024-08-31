using Microsoft.EntityFrameworkCore;
using sciencehub_backend_community.Features.Discussions.Models;
using sciencehub_backend_core.Core.Discussions.DTOs;
using sciencehub_backend_core.Data;

namespace sciencehub_backend_core.Core.Discussions.Repositories
{
    public class DiscussionRepository : IDiscussionRepository
    {
        private readonly CommunityServiceDbContext _context;

        public DiscussionRepository(CommunityServiceDbContext context)
        {
            _context = context;
        }

        public async Task<List<Discussion>> GetDiscussionsByUserId(Guid userId) 
        {
            return await _context.Discussions
                .Where(d => d.UserId == userId)
                .ToListAsync();
        }
    }
}