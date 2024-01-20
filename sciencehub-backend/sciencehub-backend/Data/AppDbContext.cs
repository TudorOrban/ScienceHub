using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Features.Works.Models.ProjectWorks;
using sciencehub_backend.Features.Works.Models.WorkUsers;
using sciencehub_backend.Shared.Enums;

namespace sciencehub_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ConfigureProjectEntities(modelBuilder);

            ConfigureWorkEntities(modelBuilder);

            ConfigureSubmissionEntities(modelBuilder);


            // Handle enums

            modelBuilder.HasPostgresEnum<SubmissionStatus>();
            modelBuilder.HasPostgresEnum<WorkType>();

            modelBuilder.Entity<WorkVersion>()
                .Property(wv => wv.WorkType)
                .HasConversion(new EnumToStringConverter<WorkType>())
                .HasColumnType("work_type");


            modelBuilder.Entity<WorkGraph>()
                .Property(wv => wv.WorkType)
                .HasConversion(new EnumToStringConverter<WorkType>())
                .HasColumnType("work_type");
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

            // Set up JSONB serialization for project graphs
            modelBuilder.Entity<ProjectGraph>(entity =>
            {
                entity.ToTable("project_versions_graphs");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ProjectId).HasColumnName("project_id");
                entity.Property(e => e.GraphData).HasColumnName("graph_data").HasColumnType("jsonb");
            });
        }

        private void ConfigureWorkEntities(ModelBuilder modelBuilder)
        {
            // Works
            modelBuilder.Entity<Paper>().ToTable("papers");
            modelBuilder.Entity<Experiment>().ToTable("experiments");
            modelBuilder.Entity<Dataset>().ToTable("datasets");
            modelBuilder.Entity<DataAnalysis>().ToTable("data_analyses");
            modelBuilder.Entity<AIModel>().ToTable("ai_models");
            modelBuilder.Entity<CodeBlock>().ToTable("code_blocks");

            // - Many-to-many's with users
            modelBuilder.Entity<PaperUser>()
                .ToTable("paper_users")
                .HasKey(pu => new { pu.PaperId, pu.UserId });

            modelBuilder.Entity<PaperUser>()
                .HasOne(pu => pu.Paper)
                .WithMany(p => p.PaperUsers)
                .HasForeignKey(pu => pu.PaperId);

            modelBuilder.Entity<PaperUser>()
                .HasOne(pu => pu.User)
                .WithMany(u => u.PaperUsers)
                .HasForeignKey(pu => pu.UserId);

            modelBuilder.Entity<ExperimentUser>()
                .ToTable("experiment_users")
                .HasKey(eu => new { eu.ExperimentId, eu.UserId });

            modelBuilder.Entity<ExperimentUser>()
                .HasOne(eu => eu.Experiment)
                .WithMany(e => e.ExperimentUsers)
                .HasForeignKey(eu => eu.ExperimentId);

            modelBuilder.Entity<ExperimentUser>()
                .HasOne(eu => eu.User)
                .WithMany(u => u.ExperimentUsers)
                .HasForeignKey(eu => eu.UserId);

            modelBuilder.Entity<DatasetUser>()
                .ToTable("dataset_users")
                .HasKey(du => new { du.DatasetId, du.UserId });

            modelBuilder.Entity<DatasetUser>()
                .HasOne(du => du.Dataset)
                .WithMany(d => d.DatasetUsers)
                .HasForeignKey(du => du.DatasetId);

            modelBuilder.Entity<DatasetUser>()
                .HasOne(du => du.User)
                .WithMany(u => u.DatasetUsers)
                .HasForeignKey(du => du.UserId);

            modelBuilder.Entity<DataAnalysisUser>()
                .ToTable("data_analysis_users")
                .HasKey(dau => new { dau.DataAnalysisId, dau.UserId });

            modelBuilder.Entity<DataAnalysisUser>()
                .HasOne(dau => dau.DataAnalysis)
                .WithMany(da => da.DataAnalysisUsers)
                .HasForeignKey(dau => dau.DataAnalysisId);

            modelBuilder.Entity<DataAnalysisUser>()
                .HasOne(dau => dau.User)
                .WithMany(u => u.DataAnalysisUsers)
                .HasForeignKey(dau => dau.UserId);

            modelBuilder.Entity<AIModelUser>()
                .ToTable("ai_model_users")
                .HasKey(aiu => new { aiu.AIModelId, aiu.UserId });

            modelBuilder.Entity<AIModelUser>()
                .HasOne(aiu => aiu.AIModel)
                .WithMany(ai => ai.AIModelUsers)
                .HasForeignKey(aiu => aiu.AIModelId);

            modelBuilder.Entity<AIModelUser>()
                .HasOne(aiu => aiu.User)
                .WithMany(u => u.AIModelUsers)
                .HasForeignKey(aiu => aiu.UserId);

            modelBuilder.Entity<CodeBlockUser>()
                .ToTable("code_block_users")
                .HasKey(cbu => new { cbu.CodeBlockId, cbu.UserId });

            modelBuilder.Entity<CodeBlockUser>()
                .HasOne(cbu => cbu.CodeBlock)
                .WithMany(cb => cb.CodeBlockUsers)
                .HasForeignKey(cbu => cbu.CodeBlockId);

            modelBuilder.Entity<CodeBlockUser>()
                .HasOne(cbu => cbu.User)
                .WithMany(u => u.CodeBlockUsers)
                .HasForeignKey(cbu => cbu.UserId);

            // - Many-to-many's with projects
            modelBuilder.Entity<ProjectPaper>()
                .ToTable("project_papers")
                .HasKey(pp => new { pp.ProjectId, pp.PaperId });

            modelBuilder.Entity<ProjectPaper>()
                .HasOne(pp => pp.Project)
                .WithMany(p => p.ProjectPapers)
                .HasForeignKey(pp => pp.ProjectId);

            modelBuilder.Entity<ProjectPaper>()
                .HasOne(pp => pp.Paper)
                .WithMany(p => p.ProjectPapers)
                .HasForeignKey(pp => pp.PaperId);

            modelBuilder.Entity<ProjectExperiment>()
                .ToTable("project_experiments")
                .HasKey(pe => new { pe.ProjectId, pe.ExperimentId });

            modelBuilder.Entity<ProjectExperiment>()
                .HasOne(pe => pe.Project)
                .WithMany(e => e.ProjectExperiments)
                .HasForeignKey(pe => pe.ProjectId);

            modelBuilder.Entity<ProjectExperiment>()
                .HasOne(pe => pe.Experiment)
                .WithMany(p => p.ProjectExperiments)
                .HasForeignKey(pe => pe.ExperimentId);

            modelBuilder.Entity<ProjectDataset>()
                .ToTable("project_datasets")
                .HasKey(pd => new { pd.ProjectId, pd.DatasetId });

            modelBuilder.Entity<ProjectDataset>()
                .HasOne(pd => pd.Project)
                .WithMany(d => d.ProjectDatasets)
                .HasForeignKey(pd => pd.ProjectId);

            modelBuilder.Entity<ProjectDataset>()
                .HasOne(pd => pd.Dataset)
                .WithMany(p => p.ProjectDatasets)
                .HasForeignKey(pd => pd.DatasetId);

            modelBuilder.Entity<ProjectDataAnalysis>()
                .ToTable("project_data_analyses")
                .HasKey(pda => new { pda.ProjectId, pda.DataAnalysisId });

            modelBuilder.Entity<ProjectDataAnalysis>()
                .HasOne(pda => pda.Project)
                .WithMany(da => da.ProjectDataAnalyses)
                .HasForeignKey(pda => pda.ProjectId);

            modelBuilder.Entity<ProjectDataAnalysis>()
                .HasOne(pda => pda.DataAnalysis)
                .WithMany(p => p.ProjectDataAnalyses)
                .HasForeignKey(pda => pda.DataAnalysisId);

            modelBuilder.Entity<ProjectAIModel>()
                .ToTable("project_ai_models")
                .HasKey(pai => new { pai.ProjectId, pai.AIModelId });

            modelBuilder.Entity<ProjectAIModel>()
                .HasOne(pai => pai.Project)
                .WithMany(ai => ai.ProjectAIModels)
                .HasForeignKey(pai => pai.ProjectId);

            modelBuilder.Entity<ProjectAIModel>()
                .HasOne(pai => pai.AIModel)
                .WithMany(p => p.ProjectAIModels)
                .HasForeignKey(pai => pai.AIModelId);

            modelBuilder.Entity<ProjectCodeBlock>()
                .ToTable("project_code_blocks")
                .HasKey(pcb => new { pcb.ProjectId, pcb.CodeBlockId });

            modelBuilder.Entity<ProjectCodeBlock>()
                .HasOne(pcb => pcb.Project)
                .WithMany(cb => cb.ProjectCodeBlocks)
                .HasForeignKey(pcb => pcb.ProjectId);

            modelBuilder.Entity<ProjectCodeBlock>()
                .HasOne(pcb => pcb.CodeBlock)
                .WithMany(p => p.ProjectCodeBlocks)
                .HasForeignKey(pcb => pcb.CodeBlockId);
        }

        private void ConfigureSubmissionEntities(ModelBuilder modelBuilder)
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
        }

        // Projects
        public DbSet<Project> Projects { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ProjectUser> ProjectUsers { get; set; }
        public DbSet<ProjectVersion> ProjectVersions { get; set; }
        public DbSet<ProjectGraph> ProjectGraphs { get; set; }

        // Works
        public DbSet<Paper> Papers { get; set; }
        public DbSet<Experiment> Experiments { get; set; }
        public DbSet<Dataset> Datasets { get; set; }
        public DbSet<DataAnalysis> DataAnalyses { get; set; }
        public DbSet<AIModel> AIModels { get; set; }
        public DbSet<CodeBlock> CodeBlocks { get; set; }

        public DbSet<PaperUser> PaperUsers { get; set; }
        public DbSet<ExperimentUser> ExperimentUsers { get; set; }
        public DbSet<DatasetUser> DatasetUsers { get; set; }
        public DbSet<DataAnalysisUser> DataAnalysisUsers { get; set; }
        public DbSet<AIModelUser> AIModelUsers { get; set; }
        public DbSet<CodeBlockUser> CodeBlockUsers { get; set; }

        public DbSet<ProjectPaper> ProjectPapers { get; set; }
        public DbSet<ProjectExperiment> ProjectExperiments { get; set; }
        public DbSet<ProjectDataset> ProjectDatasets { get; set; }
        public DbSet<ProjectDataAnalysis> ProjectDataAnalyses { get; set; }
        public DbSet<ProjectAIModel> ProjectAIModels { get; set; } 
        public DbSet<ProjectCodeBlock> ProjectCodeBlocks { get; set; } 

        public DbSet<WorkVersion> WorkVersions { get; set; }
        public DbSet<WorkGraph> WorkGraphs { get; set; }

        public DbSet<ProjectSubmission> ProjectSubmissions { get; set; }
        public DbSet<WorkSubmission> WorkSubmissions { get; set; }
        public DbSet<ProjectWorkSubmission> ProjectWorkSubmissions { get; set; }
        public DbSet<ProjectSubmissionUser> ProjectSubmissionUsers { get; set; }
        public DbSet<WorkSubmissionUser> WorkSubmissionUsers { get; set; }
    }
}
