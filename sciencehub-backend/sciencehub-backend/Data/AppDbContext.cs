using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.features.Projects.Models;

namespace sciencehub_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //base.OnModelCreating(modelBuilder);

            // Configure many-to-many relationships
            //modelBuilder.Entity<Project>()
            //    .HasMany(p => p.Users)
            //    .WithMany(u => u.Projects)
            //    .UsingEntity(j => j.ToTable("project_users"));
        }
        public DbSet<Project> Projects { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
