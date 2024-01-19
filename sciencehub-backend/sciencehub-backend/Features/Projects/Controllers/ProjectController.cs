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
    public class ProjectController : Controller
    {
        // GET: ProjectController
        private readonly AppDbContext _context;
        private readonly ProjectService _projectService;

        public ProjectController(AppDbContext context, ProjectService projectService)
        {
            _context = context;
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {

            var projects = await _context.Projects.ToListAsync();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects
                .Where(p => p.Id == id)
                .Include(p => p.ProjectUsers) // Include project users
                    .ThenInclude(pu => pu.User)
                .FirstOrDefaultAsync();

            if (project == null)
            {
                return NotFound();
            }
            return project;
        }

        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject([FromBody] CreateProjectDto createProjectDto, [FromServices] SanitizerService sanitizerService)
        {
            var createdProject = await _projectService.CreateProjectAsync(createProjectDto, sanitizerService);

            return CreatedAtAction(nameof(GetProjects), new { id = createdProject.Id }, createdProject);
        }

    }
}
