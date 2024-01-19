using sciencehub_backend.Data;
using sciencehub_backend.features.Projects.Models;
using sciencehub_backend.Features.Projects.Dto;

namespace sciencehub_backend.Features.Projects.Services
{
    public class ProjectService
    {
        private readonly AppDbContext _context;

        public ProjectService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Project> CreateProjectAsync(CreateProjectDto createProjectDto)
        {
            // TODO: Sanitize inputs
            var project = new Project
            {
                Name = createProjectDto.Name,
                Title = createProjectDto.Title,
                Description = createProjectDto.Description,
                Public = createProjectDto.Public,
            };
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return project;
        }
    }
}
