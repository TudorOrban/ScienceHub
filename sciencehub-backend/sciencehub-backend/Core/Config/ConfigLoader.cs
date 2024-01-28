
using Microsoft.EntityFrameworkCore;
using Npgsql;
using sciencehub_backend.Data;
using sciencehub_backend.Exceptions;
using sciencehub_backend.Features.Issues.Services;
using sciencehub_backend.Features.Metrics.Research.Services;
using sciencehub_backend.Features.Projects.Services;
using sciencehub_backend.Features.Reviews.Services;
using sciencehub_backend.Features.Submissions.Services;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Services;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Services;
using sciencehub_backend.Features.Works.Services;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Serialization;
using sciencehub_backend.Shared.Validation;
using System.Text.Json.Serialization;

namespace sciencehub_backend.Core.Config
{
    public static class ConfigLoader
    {
        public static WebApplication ConfigureApplication(WebApplicationBuilder builder, bool isTest = false)
        {
            ConfigureServices(builder);
            ConfigureDatabase(builder, isTest);
            ConfigureCors(builder);

            var app = builder.Build();
            ConfigureMiddleware(app);

            return app;
        }

        // Add services to the container
        public static void ConfigureServices(WebApplicationBuilder builder)
        {
            builder.Services.AddScoped<SanitizerService>();
            builder.Services.AddScoped<ProjectService>();
            builder.Services.AddScoped<WorkUtilsService>();
            builder.Services.AddScoped<WorkService>();
            builder.Services.AddScoped<SubmissionService>();
            builder.Services.AddScoped<ProjectSubmissionChangeService>();
            builder.Services.AddScoped<WorkSubmissionChangeService>();
            builder.Services.AddScoped<GraphService>();
            builder.Services.AddScoped<SnapshotService>();
            builder.Services.AddScoped<SnapshotManager>();
            builder.Services.AddScoped<WorkReconstructionService>();
            builder.Services.AddScoped<DiffManager>();
            builder.Services.AddScoped<TextDiffManager>();
            builder.Services.AddScoped<DatabaseValidation>();
            builder.Services.AddScoped<IssueService>();
            builder.Services.AddScoped<ReviewService>();
            builder.Services.AddScoped<CustomJsonSerializer>();

            builder.Services.AddHostedService<MetricsBackgroundService>();

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

                builder.Services.AddDbContext<AppDbContext>(options =>
                    options.UseNpgsql(dataSource));
            }
            else
            {
                // Configure for in-memory database
                builder.Services.AddDbContext<AppDbContext>(options =>
                    options.UseInMemoryDatabase("InMemoryDbForTesting"));

                // Build the service provider and create a scope
                var serviceProvider = builder.Services.BuildServiceProvider();
                using var scope = serviceProvider.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

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
