using Microsoft.EntityFrameworkCore;
using sciencehub_backend_community.Data;
using sciencehub_backend_community.Features.Discussions.Models;

namespace sciencehub_backend_community.Features.Discussions.Repositories
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