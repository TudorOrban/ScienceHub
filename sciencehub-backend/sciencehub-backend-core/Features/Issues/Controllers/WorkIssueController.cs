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
