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
        private readonly ILogger<ProjectController> _logger;

        public ProjectController(AppDbContext context, IProjectService projectService, ILogger<ProjectController> logger)
        {
            _context = context;
            _projectService = projectService;
            _logger = logger;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects(string userId)
        {
            if (!Guid.TryParse(userId, out Guid parsedUserId))
            {
                return BadRequest("Invalid User ID format");
            }

            var projects = await _projectService.GetProjectsByUserIdAsync(parsedUserId);
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

        [HttpDelete("{id}")]
        public async Task<ActionResult<Project>> DeleteProject(int id)
        {
            var projectId = await _projectService.DeleteProjectAsync(id);
            return Ok(projectId);
        }

    }
}
