﻿using sciencehub_backend.Data;
using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Projects.Dto;
using sciencehub_backend.Shared.Validation;

namespace sciencehub_backend.Features.Projects.Services
{
    public class ProjectService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProjectService> _logger;
        private readonly DatabaseValidation _databaseValidation;

        public ProjectService(AppDbContext context, ILogger<ProjectService> logger)
        {
            _context = context;
            _logger = logger;
            _databaseValidation = new DatabaseValidation(context);
        }

        public async Task<Project> CreateProjectAsync(CreateProjectDto createProjectDto, SanitizerService sanitizerService)
        {
            // Use transaction
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var project = new Project
                {
                    Name = sanitizerService.Sanitize(createProjectDto.Name),
                    Title = sanitizerService.Sanitize(createProjectDto.Title),
                    Description = sanitizerService.Sanitize(createProjectDto.Description),
                    Link = createProjectDto.Link,
                    Public = createProjectDto.Public,
                    ProjectUsers = new List<ProjectUser>(),
                };

                // Add users to project
                foreach (var userIdString in createProjectDto.Users)
                {
                    // Verify provided userId is valid UUID and exists in database
                    var userId = await _databaseValidation.ValidateUserId(userIdString);

                    // Add user
                    project.ProjectUsers.Add(new ProjectUser { UserId = userId, Project = project, Role = "Main Author" });
                }

                _context.Projects.Add(project);
                await _context.SaveChangesAsync();

                // Generate an initial project version
                var initialProjectVersion = new ProjectVersion
                {
                    ProjectId = project.Id,
                };
                _context.ProjectVersions.Add(initialProjectVersion);
                await _context.SaveChangesAsync();

                // Update the project with the current project version ID
                project.CurrentProjectVersionId = initialProjectVersion.Id;
                _context.Projects.Update(project);
                await _context.SaveChangesAsync();

                // Create initial project graph with a single node = initial version ID
                var projectGraph = new ProjectGraph
                {
                    ProjectId = project.Id,
                    GraphDataParsed = new Dictionary<string, GraphNode>
                    {
                        {
                            initialProjectVersion.Id.ToString(), new GraphNode
                            {
                                Neighbors = new List<string>(), IsSnapshot = true
                            }
                        }
                    }
                };
                _context.ProjectGraphs.Add(projectGraph);
                await _context.SaveChangesAsync();


                // Commit transaction
                transaction.Commit();

                return project;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError(ex, "An error occurred in CreateProjectAsync");
                throw;
            }

        }
    }
}
