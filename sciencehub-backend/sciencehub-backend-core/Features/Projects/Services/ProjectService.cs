using sciencehub_backend_core.Data;
using sciencehub_backend_core.Features.Projects.Models;
using sciencehub_backend_core.Features.Projects.DTO;
using sciencehub_backend_core.Shared.Validation;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend_core.Shared.Sanitation;
using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Shared.Search;
using sciencehub_backend_core.Features.Projects.Repositories;

namespace sciencehub_backend_core.Features.Projects.Services
{
    public class ProjectService : IProjectService
    {
        private readonly CoreServiceDbContext _context;
        private readonly IProjectRepository _projectRepository;
        private readonly ILogger<ProjectService> _logger;
        private readonly IDatabaseValidation _databaseValidation;
        private readonly ISanitizerService _sanitizerService;

        public ProjectService(
            CoreServiceDbContext context, 
            IProjectRepository projectRepository,
            ILogger<ProjectService> logger, 
            ISanitizerService sanitizerService, 
            IDatabaseValidation databaseValidation
        )
        {
            _context = context;
            _projectRepository = projectRepository;
            _logger = logger;
            _sanitizerService = sanitizerService;
            _databaseValidation = databaseValidation;
        }
        
        public async Task<PaginatedResults<ProjectSearchDTO>> GetProjectsByUserIdAsync(Guid userId, SearchParams searchParams)
        {
            var paginatedProjects = await _projectRepository.GetProjectsByUserIdAsync(userId, searchParams);
            
            // Attach users
            var projectDTOs = attachUsers(paginatedProjects);

            return new PaginatedResults<ProjectSearchDTO>
            {
                Results = projectDTOs,
                TotalCount = paginatedProjects.TotalCount
            };
        }

        public async Task<Project> GetProjectByIdAsync(int projectId)
        {
            var project = await _context.Projects
                .Where(p => p.Id == projectId)
                .Include(p => p.ProjectUsers)
                    .ThenInclude(pu => pu.User)
                .FirstOrDefaultAsync();

            return project!;
        }

        private List<ProjectSearchDTO> attachUsers(PaginatedResults<Project> paginatedProjects)
        {
            var projectDTOs = paginatedProjects.Results.Select(p => new ProjectSearchDTO
            {
                Id = p.Id,
                Name = p.Name,
                Title = p.Title,
                ProjectUsers = p.ProjectUsers.Select(pu => new ProjectUserDTO
                {
                    ProjectId = pu.ProjectId,
                    UserId = pu.UserId,
                    Role = pu.Role,
                    User = new UserDTO
                    {
                        Id = pu.User.Id,
                        Username = pu.User.Username,
                        FullName = pu.User.FullName
                    }
                }).ToList()
            }).ToList();

            return projectDTOs;
        }

        public async Task<Project> CreateProjectAsync(CreateProjectDTO createProjectDTO)
        {
            // Use transaction
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var project = new Project
                {
                    Name = _sanitizerService.Sanitize(createProjectDTO.Name),
                    Title = _sanitizerService.Sanitize(createProjectDTO.Title),
                    Description = _sanitizerService.Sanitize(createProjectDTO.Description),
                    Link = createProjectDTO.Link,
                    Public = createProjectDTO.Public,
                    ProjectUsers = new List<ProjectUser>(),
                };

                // Add users to project
                foreach (var userIdString in createProjectDTO.Users)
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
