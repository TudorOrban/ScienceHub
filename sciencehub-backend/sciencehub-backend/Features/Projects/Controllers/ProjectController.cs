using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Data;
using sciencehub_backend.features.Projects.Models;
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

        public ProjectController(AppDbContext context)
        {
            _context = context;
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
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            return project;
        }

        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(CreateProjectDto createProjectDto)
        {
            var createdProject = await _projectService.CreateProjectAsync(createProjectDto);
            return CreatedAtAction(nameof(GetProjects), new { id = createdProject.Id }, createdProject);
        }
    }
}
