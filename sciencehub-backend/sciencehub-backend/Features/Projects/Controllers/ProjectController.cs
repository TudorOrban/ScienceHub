using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Data;
using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Projects.Dto;
using sciencehub_backend.Features.Projects.Services;

namespace sciencehub_backend.Features.Projects.Controllers
{
    [ApiController]
    [Route("api/v1/projects")]
    public class ProjectController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IProjectService _projectService;

        public ProjectController(AppDbContext context, IProjectService projectService)
        {
            _context = context;
            _projectService = projectService;
        }

        [HttpGet("/user/{userId}")]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects(string userId)
        {

            var projects = await _projectService.GetProjectsByUserIdAsync(Guid.Parse(userId));
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _projectService.GetProjectByIdAsync(id);

            if (project == null)
            {
                return NotFound();
            }
            return project;
        }

        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject([FromBody] CreateProjectDto createProjectDto)
        {
            var createdProject = await _projectService.CreateProjectAsync(createProjectDto);

            return CreatedAtAction(nameof(GetProjects), new { id = createdProject.Id }, createdProject);
        }

    }
}
