using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Features.Projects.Models;
using sciencehub_backend_core.Features.Projects.DTO;
using sciencehub_backend_core.Features.Projects.Services;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Projects.Controllers
{
    [ApiController]
    [Route("api/v1/projects")]
    public class ProjectController : ControllerBase
    {
        private readonly CoreServiceDbContext _context;
        private readonly IProjectService _projectService;
        private readonly ILogger<ProjectController> _logger;

        public ProjectController(CoreServiceDbContext context, IProjectService projectService, ILogger<ProjectController> logger)
        {
            _context = context;
            _projectService = projectService;
            _logger = logger;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<PaginatedResults<ProjectSearchDTO>>> GetProjects(
            string userId,
            [FromQuery] string searchTerm = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "Name",
            [FromQuery] bool sortDescending = false)
        {
            if (!Guid.TryParse(userId, out Guid parsedUserId))
            {
                return BadRequest("Invalid User ID format");
            }
            SearchParams searchParams = new SearchParams { SearchQuery = searchTerm, Page = page, ItemsPerPage = pageSize, SortBy = sortBy, SortDescending = sortDescending };

            var projects = await _projectService.GetProjectsByUserIdAsync(parsedUserId, searchParams);

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
        public async Task<ActionResult<Project>> CreateProject([FromBody] CreateProjectDTO createProjectDTO)
        {
            var createdProject = await _projectService.CreateProjectAsync(createProjectDTO);

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
