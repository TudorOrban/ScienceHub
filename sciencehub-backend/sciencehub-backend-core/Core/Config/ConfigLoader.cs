
using Microsoft.EntityFrameworkCore;
using Npgsql;
using sciencehub_backend_core.Core.Users.Services;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions;
using sciencehub_backend_core.Features.Issues.Services;
using sciencehub_backend_core.Features.Metrics;
using sciencehub_backend_core.Features.Metrics.Research.Services;
using sciencehub_backend_core.Features.Projects.Repositories;
using sciencehub_backend_core.Features.Projects.Services;
using sciencehub_backend_core.Features.Reviews.Repositories;
using sciencehub_backend_core.Features.Reviews.Services;
using sciencehub_backend_core.Features.Submissions.Services;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Reconstruction;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Reconstruction.Services;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Services;
using sciencehub_backend_core.Features.Works.Services;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Sanitation;
using sciencehub_backend_core.Shared.Serialization;
using sciencehub_backend_core.Shared.Validation;
using System.Text.Json.Serialization;

namespace sciencehub_backend_core.Core.Config
{
    public static class ConfigLoader
    {
        public static WebApplication ConfigureApplication(WebApplicationBuilder builder, bool isTest = false)
        {
            ConfigureServices(builder);
            ConfigureDatabase(builder, isTest);
            ConfigureCors(builder);
            builder.Logging.SetMinimumLevel(LogLevel.Trace);

            var app = builder.Build();
            ConfigureMiddleware(app);

            return app;
        }

        // Add services to the container
        public static void ConfigureServices(WebApplicationBuilder builder)
        {
            // Users
            builder.Services.AddScoped<IUserService, UserService>();
            
            // Projects
            builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
            builder.Services.AddScoped<IProjectService, ProjectService>();

            // Works
            builder.Services.AddScoped<IWorkService, WorkService>();
            builder.Services.AddScoped<IWorkUtilsService, WorkUtilsService>();

            // Version control
            builder.Services.AddScoped<ISubmissionService, SubmissionService>();
            builder.Services.AddScoped<IProjectSubmissionSubmitService, ProjectSubmissionSubmitService>();
            builder.Services.AddScoped<IWorkSubmissionSubmitService, WorkSubmissionSubmitService>();
            builder.Services.AddScoped<IProjectSubmissionAcceptService, ProjectSubmissionAcceptService>();
            builder.Services.AddScoped<IWorkSubmissionAcceptService, WorkSubmissionAcceptService>();
            builder.Services.AddScoped<IGraphService, GraphService>();
            builder.Services.AddScoped<ISnapshotService, SnapshotService>();
            builder.Services.AddScoped<ISnapshotManager, SnapshotManager>();
            builder.Services.AddScoped<IWorkReconstructionService, WorkReconstructionService>();
            builder.Services.AddScoped<IDiffManager, DiffManager>();
            builder.Services.AddScoped<ITextDiffManager, TextDiffManager>();

            // Management
            builder.Services.AddScoped<IIssueService, IssueService>();
            builder.Services.AddScoped<IProjectReviewRepository, ProjectReviewRepository>();
            builder.Services.AddScoped<IProjectReviewService, ProjectReviewService>();
            builder.Services.AddScoped<IWorkReviewRepository, WorkReviewRepository>();
            builder.Services.AddScoped<IWorkReviewService, WorkReviewService>();

            // Reusable
            builder.Services.AddTransient<ISanitizerService, SanitizerService>();
            builder.Services.AddTransient<CustomJsonSerializer>();
            builder.Services.AddScoped<IDatabaseValidation, DatabaseValidation>();

            // Background services
            builder.Services.AddHostedService<MetricsBackgroundService>();
            builder.Services.AddTransient<IResearchMetricsCalculator, ResearchMetricsCalculator>();

            // Configure ER to avoid circular references
            builder.Services.AddControllers().AddJsonOptions(options =>
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
        }

        // Add database connection
        public static void ConfigureDatabase(WebApplicationBuilder builder, bool isTest = false)
        {
            if (!isTest)
            {
                var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
                var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);

                dataSourceBuilder.MapEnum<SubmissionStatus>();
                dataSourceBuilder.MapEnum<IssueStatus>();
                dataSourceBuilder.MapEnum<ReviewStatus>();
                dataSourceBuilder.MapEnum<WorkType>();

                dataSourceBuilder.EnableDynamicJson();

                var dataSource = dataSourceBuilder.Build();

                builder.Services.AddDbContext<CoreServiceDbContext>(options =>
                    options.UseNpgsql(dataSource));
            }
            else
            {
                // Configure for in-memory database
                builder.Services.AddDbContext<CoreServiceDbContext>(options =>
                    options.UseInMemoryDatabase("InMemoryDbForTesting"));

                // Build the service provider and create a scope
                var serviceProvider = builder.Services.BuildServiceProvider();
                using var scope = serviceProvider.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<CoreServiceDbContext>();

                // Ensure the database is created
                db.Database.EnsureCreated();
            }
        }

        // Configure CORS policy
        public static void ConfigureCors(WebApplicationBuilder builder)
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    corsBuilder => corsBuilder.WithOrigins("http://localhost:3000")
                                              .AllowAnyHeader()
                                              .AllowAnyMethod());
            });
        }

        public static void ConfigureMiddleware(WebApplication app)
        {
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseMiddleware<CustomErrorHandlingMiddleware>();
            app.UseHttpsRedirection();

            // Apply CORS policy
            app.UseCors("AllowSpecificOrigin");
            app.UseAuthorization();
            app.MapControllers();
        }
    }
}
