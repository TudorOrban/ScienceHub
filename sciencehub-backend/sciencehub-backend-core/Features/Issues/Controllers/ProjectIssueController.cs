using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Features.Issues.DTOs;
using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Features.Issues.Services;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Issues.Controllers
{
    [ApiController]
    [Route("api/v1/project-issues")]
    public class ProjectIssueController : ControllerBase
    {
        private readonly IProjectIssueService _projectIssueService;

        public ProjectIssueController(IProjectIssueService projectIssueService)
        {
            _projectIssueService = projectIssueService;
        }

        [HttpGet("{id}/project")]
        public async Task<ActionResult<ProjectIssue>> GetProjectIssue(int id)
        {
            var projectIssue = await _projectIssueService.GetProjectIssueByIdAsync(id);
            return Ok(projectIssue);
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<List<ProjectIssue>>> GetProjectIssuesByProjectId(int projectId)
        {
            var projectIssues = await _projectIssueService.GetProjectIssuesByProjectIdAsync(projectId);
            return Ok(projectIssues);
        }

        [HttpGet("project/{projectId}/search")]
        public async Task<ActionResult<PaginatedResults<ProjectIssueSearchDTO>>> SearchProjectIssuesByProjectId(
            int projectId,
            [FromQuery] string searchTerm = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "Name",
            [FromQuery] bool sortDescending = false)
        {
            SearchParams searchParams = new SearchParams { SearchQuery = searchTerm, Page = page, ItemsPerPage = pageSize, SortBy = sortBy, SortDescending = sortDescending };
            
            var projectIssues = await _projectIssueService.SearchProjectIssuesByProjectIdAsync(projectId, searchParams);

            return Ok(projectIssues);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateIssue([FromBody] CreateIssueDTO createIssueDTO)
        {
            var issueId = await _projectIssueService.CreateProjectIssueAsync(createIssueDTO);
            return CreatedAtRoute("", new { id = issueId });
        }

        [HttpPut]
        public async Task<ActionResult<int>> UpdateIssue([FromBody] UpdateIssueDTO updateIssueDTO)
        {
            var issueId = await _projectIssueService.UpdateProjectIssueAsync(updateIssueDTO);
            return Ok(issueId);
        }

        [HttpDelete("{issueId}")]
        public async Task<ActionResult<int>> DeleteIssue(int issueId)
        {
            var deletedIssueId = await _projectIssueService.DeleteProjectIssueAsync(issueId);
            return Ok(deletedIssueId);
        }
    }
}
