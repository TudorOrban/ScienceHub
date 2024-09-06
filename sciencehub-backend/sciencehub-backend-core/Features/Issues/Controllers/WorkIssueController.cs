using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Features.Issues.DTOs;
using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Features.Issues.Services;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Issues.Controllers
{
    [ApiController]
    [Route("api/v1/work-issues")]
    public class WorkIssueController : ControllerBase
    {
        private readonly IWorkIssueService _workIssueService;

        public WorkIssueController(IWorkIssueService workIssueService)
        {
            _workIssueService = workIssueService;
        }

        [HttpGet("{id}/work")]
        public async Task<ActionResult<WorkIssue>> GetWorkIssue(int id)
        {
            var workIssue = await _workIssueService.GetWorkIssueByIdAsync(id);
            return Ok(workIssue);
        }
        
        [HttpGet("work/{workId}/{workTypeString}")]
        public async Task<ActionResult<List<WorkIssue>>> GetWorkIssuesByWorkId(int workId, string workTypeString)
        {
            var workType = Enum.Parse<WorkType>(workTypeString);
            var workIssues = await _workIssueService.GetWorkIssuesByWorkIdAsync(workId, workType);
            return Ok(workIssues);
        }

        [HttpGet("work/{workId}/{workTypeString}/search")]
        public async Task<ActionResult<PaginatedResults<WorkIssueSearchDTO>>> SearchWorkIssuesByWorkId(
            int workId,
            string workTypeString,
            [FromQuery] string searchTerm = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "Name",
            [FromQuery] bool sortDescending = false)
        {
            WorkType workType = Enum.Parse<WorkType>(workTypeString);
            SearchParams searchParams = new SearchParams { SearchQuery = searchTerm, Page = page, ItemsPerPage = pageSize, SortBy = sortBy, SortDescending = sortDescending };
            
            var workIssues = await _workIssueService.SearchWorkIssuesByWorkIdAsync(workId, workType, searchParams);

            return Ok(workIssues);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateIssue([FromBody] CreateIssueDTO createIssueDTO)
        {
            var issueId = await _workIssueService.CreateWorkIssueAsync(createIssueDTO);
            return CreatedAtRoute("", new { id = issueId });
        }

        [HttpPut]
        public async Task<ActionResult<int>> UpdateIssue([FromBody] UpdateIssueDTO updateIssueDTO)
        {
            var issueId = await _workIssueService.UpdateWorkIssueAsync(updateIssueDTO);
            return Ok(issueId);
        }

        [HttpDelete("{issueId}")]
        public async Task<ActionResult<int>> DeleteIssue(int issueId)
        {
            var deletedIssueId = await _workIssueService.DeleteWorkIssueAsync(issueId);
            return Ok(deletedIssueId);
        }
    }
}
