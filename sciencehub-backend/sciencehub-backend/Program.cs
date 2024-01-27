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

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
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

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

// Add controlers
// Prevent reference cycles
builder.Services.AddControllers().AddJsonOptions(options =>
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// Add database connection
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


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Build
var app = builder.Build();

// Use global error handling middleware
app.UseMiddleware<CustomErrorHandlingMiddleware>();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Apply CORS policy
app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();

app.MapControllers();

app.Run();
