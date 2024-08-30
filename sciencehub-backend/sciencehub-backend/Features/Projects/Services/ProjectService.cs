using sciencehub_backend.Data;
using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Projects.Dto;
using sciencehub_backend.Shared.Validation;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Shared.Sanitation;
using Microsoft.EntityFrameworkCore;

namespace sciencehub_backend.Features.Projects.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProjectService> _logger;
        private readonly IDatabaseValidation _databaseValidation;
        private readonly ISanitizerService _sanitizerService;

        public ProjectService(AppDbContext context, ILogger<ProjectService> logger, ISanitizerService sanitizerService, IDatabaseValidation databaseValidation)
        {
            _context = context;
            _logger = logger;
            _sanitizerService = sanitizerService;
            _databaseValidation = databaseValidation;
        }

        public async Task<List<Project>> GetProjectsByUserIdAsync(Guid userId)
        {
            var projects = await _context.Projects
                .Where(p => p.ProjectUsers.Any(pu => pu.UserId == userId))
                .Include(p => p.ProjectUsers)
                    .ThenInclude(pu => pu.User)
                    .ToListAsync();

            return projects;
        }
        
        public async Task<Project> GetProjectByIdAsync(int projectId)
        {
            var project = await _context.Projects
                .Where(p => p.Id == projectId)
                .Include(p => p.ProjectUsers)
                    .ThenInclude(pu => pu.User)
                .FirstOrDefaultAsync();

            return project;
        }

        public async Task<Project> CreateProjectAsync(CreateProjectDto createProjectDto)
        {
            // Use transaction
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var project = new Project
                {
                    Name = _sanitizerService.Sanitize(createProjectDto.Name),
                    Title = _sanitizerService.Sanitize(createProjectDto.Title),
                    Description = _sanitizerService.Sanitize(createProjectDto.Description),
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
                    GraphData = new GraphData
                        {
                            {
                                initialProjectVersion.Id.ToString(), new GraphNode
                                {
                                    Neighbors = new List<string>(),
                                    IsSnapshot = true,
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

        public async Task<int> DeleteProjectAsync(int projectId) 
        {
            // Delete
            var project = await _context.Projects
                .Where(p => p.Id == projectId)
                .Include(p => p.ProjectUsers)
                .FirstOrDefaultAsync();

            if (project == null)
            {
                return 0;
            }

            _context.Projects.Remove(project);

            await _context.SaveChangesAsync();

            return project.Id;
        }
    }
}
