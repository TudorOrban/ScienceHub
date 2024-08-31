using Microsoft.EntityFrameworkCore;
using sciencehub_backend_community.Features.Discussions.Models;


namespace sciencehub_backend_core.Data
{
    public class CommunityServiceDbContext : DbContext
    {
        public CommunityServiceDbContext(DbContextOptions<CommunityServiceDbContext> options) : base(options)
        {

        }

        public DbSet<Discussion> Discussions { get; set; }
        public DbSet<Comment> Comments { get; set; }
    }
}
