using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Core.Users.Models;
using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Features.NewWorks.Models;
using sciencehub_backend_core.Features.Projects.Models;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Features.Submissions.Models;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Reconstruction.Models;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Data
{
    public class CoreServiceDbContext : DbContext
    {
        public CoreServiceDbContext(DbContextOptions<CoreServiceDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ConfigureProjectEntities(modelBuilder);

            ConfigureWorkEntities(modelBuilder);

            ConfigureManagementEntities(modelBuilder);

            ConfigureEnums(modelBuilder);
        }

        private void ConfigureProjectEntities(ModelBuilder modelBuilder)
        {
            // Many-to-many between projects and users
            modelBuilder.Entity<ProjectUser>()
                .ToTable("project_users")
                .HasKey(pu => new { pu.ProjectId, pu.UserId });

            modelBuilder.Entity<ProjectUser>()
                .HasOne(pu => pu.Project)
                .WithMany(p => p.ProjectUsers)
                .HasForeignKey(pu => pu.ProjectId);

            modelBuilder.Entity<ProjectUser>()
                .HasOne(pu => pu.User)
                .WithMany(u => u.ProjectUsers)
                .HasForeignKey(pu => pu.UserId);
        }

        private void ConfigureWorkEntities(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Work>().ToTable("works");
            
            modelBuilder.Entity<WorkUser>()
                .ToTable("work_users")
                .HasKey(pu => new { pu.WorkId, pu.UserId });

            modelBuilder.Entity<WorkUser>()
                .HasOne(pu => pu.Work)
                .WithMany(p => p.WorkUsers)
                .HasForeignKey(pu => pu.WorkId);

            modelBuilder.Entity<WorkUser>()
                .HasOne(pu => pu.User)
                .WithMany(u => u.WorkUsers)
                .HasForeignKey(pu => pu.UserId);

            modelBuilder.Entity<ProjectWork>()
                .ToTable("project_works")
                .HasKey(pw => new { pw.ProjectId, pw.WorkId });

            modelBuilder.Entity<ProjectWork>()
                .HasOne(pw => pw.Project)
                .WithMany(p => p.ProjectWorks)
                .HasForeignKey(pw => pw.ProjectId);

            modelBuilder.Entity<ProjectWork>()
                .HasOne(pw => pw.Work)
                .WithMany(w => w.ProjectWorks)
                .HasForeignKey(pw => pw.WorkId);
        }

        private void ConfigureManagementEntities(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProjectWorkSubmission>()
                .ToTable("project_work_submissions")
                .HasKey(pws => new { pws.ProjectSubmissionId, pws.WorkSubmissionId });

            modelBuilder.Entity<ProjectWorkSubmission>()
                .HasOne(pws => pws.ProjectSubmission)
                .WithMany(ps => ps.ProjectWorkSubmissions)
                .HasForeignKey(pws => pws.ProjectSubmissionId);

            modelBuilder.Entity<ProjectWorkSubmission>()
                .HasOne(pws => pws.WorkSubmission)
                .WithMany(ws => ws.ProjectWorkSubmissions)
                .HasForeignKey(pws => pws.WorkSubmissionId);

            modelBuilder.Entity<ProjectSubmissionUser>()
                .ToTable("project_submission_users")
                .HasKey(psu => new { psu.ProjectSubmissionId, psu.UserId });

            modelBuilder.Entity<ProjectSubmissionUser>()
                .HasOne(psu => psu.ProjectSubmission)
                .WithMany(ps => ps.ProjectSubmissionUsers)
                .HasForeignKey(psu => psu.ProjectSubmissionId);

            modelBuilder.Entity<ProjectSubmissionUser>()
                .HasOne(psu => psu.User)
                .WithMany(u => u.ProjectSubmissionUsers)
                .HasForeignKey(psu => psu.UserId);

            modelBuilder.Entity<WorkSubmissionUser>()
                .ToTable("work_submission_users")
                .HasKey(wsu => new { wsu.WorkSubmissionId, wsu.UserId });

            modelBuilder.Entity<WorkSubmissionUser>()
                .HasOne(wsu => wsu.WorkSubmission)
                .WithMany(ws => ws.WorkSubmissionUsers)
                .HasForeignKey(wsu => wsu.WorkSubmissionId);

            modelBuilder.Entity<WorkSubmissionUser>()
                .HasOne(wsu => wsu.User)
                .WithMany(u => u.WorkSubmissionUsers)
                .HasForeignKey(wsu => wsu.UserId);

            modelBuilder.Entity<ProjectIssueUser>()
                .ToTable("project_issue_users")
                .HasKey(piu => new { piu.ProjectIssueId, piu.UserId });

            modelBuilder.Entity<ProjectIssueUser>()
                .HasOne(piu => piu.ProjectIssue)
                .WithMany(pi => pi.ProjectIssueUsers)
                .HasForeignKey(piu => piu.ProjectIssueId);

            modelBuilder.Entity<ProjectIssueUser>()
                .HasOne(piu => piu.User)
                .WithMany(u => u.ProjectIssueUsers)
                .HasForeignKey(piu => piu.UserId);

            modelBuilder.Entity<WorkIssueUser>()
                .ToTable("work_issue_users")
                .HasKey(wiu => new { wiu.WorkIssueId, wiu.UserId });

            modelBuilder.Entity<WorkIssueUser>()
                .HasOne(wiu => wiu.WorkIssue)
                .WithMany(wi => wi.WorkIssueUsers)
                .HasForeignKey(wiu => wiu.WorkIssueId);

            modelBuilder.Entity<WorkIssueUser>()
                .HasOne(wiu => wiu.User)
                .WithMany(u => u.WorkIssueUsers)
                .HasForeignKey(wiu => wiu.UserId);

            modelBuilder.Entity<ProjectReviewUser>()
                .ToTable("project_review_users")
                .HasKey(pru => new { pru.ProjectReviewId, pru.UserId });

            modelBuilder.Entity<ProjectReviewUser>()
                .HasOne(pru => pru.ProjectReview)
                .WithMany(pr => pr.ProjectReviewUsers)
                .HasForeignKey(pru => pru.ProjectReviewId);

            modelBuilder.Entity<ProjectReviewUser>()
                .HasOne(pru => pru.User)
                .WithMany(u => u.ProjectReviewUsers)
                .HasForeignKey(pru => pru.UserId);

            modelBuilder.Entity<WorkReviewUser>()
                .ToTable("work_review_users")
                .HasKey(wru => new { wru.WorkReviewId, wru.UserId });

            modelBuilder.Entity<WorkReviewUser>()
                .HasOne(wru => wru.WorkReview)
                .WithMany(wr => wr.WorkReviewUsers)
                .HasForeignKey(wru => wru.WorkReviewId);

            modelBuilder.Entity<WorkReviewUser>()
                .HasOne(wru => wru.User)
                .WithMany(u => u.WorkReviewUsers)
                .HasForeignKey(wru => wru.UserId);
        }

        private void ConfigureEnums(ModelBuilder modelBuilder)
        {
            // Register enums
            modelBuilder.HasPostgresEnum<SubmissionStatus>();
            modelBuilder.HasPostgresEnum<IssueStatus>();
            modelBuilder.HasPostgresEnum<ReviewStatus>();
            modelBuilder.HasPostgresEnum<WorkType>();
        }

        // Projects
        public DbSet<Project> Projects { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ProjectUser> ProjectUsers { get; set; }
        public DbSet<ProjectVersion> ProjectVersions { get; set; }
        public DbSet<ProjectGraph> ProjectGraphs { get; set; }

        // Works
        public DbSet<Work> Works { get; set; }
        public DbSet<WorkUser> WorkUsers { get; set; }
        public DbSet<ProjectWork> ProjectWorks { get; set; }

        // Version control
        public DbSet<WorkVersion> WorkVersions { get; set; }
        public DbSet<WorkGraph> WorkGraphs { get; set; }
        public DbSet<WorkSnapshot> WorkSnapshots { get; set; }
        public DbSet<ProjectSnapshot> ProjectSnapshots { get; set; }
        
        public DbSet<ProjectSubmission> ProjectSubmissions { get; set; }
        public DbSet<WorkSubmission> WorkSubmissions { get; set; }
        public DbSet<ProjectWorkSubmission> ProjectWorkSubmissions { get; set; }
        public DbSet<ProjectSubmissionUser> ProjectSubmissionUsers { get; set; }
        public DbSet<WorkSubmissionUser> WorkSubmissionUsers { get; set; }

        // Rest of management
        public DbSet<ProjectIssue> ProjectIssues { get; set; }
        public DbSet<WorkIssue> WorkIssues { get; set; }
        public DbSet<ProjectIssueUser> ProjectIssueUsers { get; set; }
        public DbSet<WorkIssueUser> WorkIssueUsers { get; set; }
        public DbSet<ProjectReview> ProjectReviews { get; set; }
        public DbSet<WorkReview> WorkReviews { get; set; }
        public DbSet<ProjectReviewUser> ProjectReviewUsers { get; set; }
        public DbSet<WorkReviewUser> WorkReviewUsers { get; set; }

    }
}
