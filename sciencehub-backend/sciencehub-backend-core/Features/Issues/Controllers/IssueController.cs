using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Features.Issues.DTOs;
using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Features.Issues.Services;

namespace sciencehub_backend_core.Features.Issues.Controllers
{
    [ApiController]
    [Route("api/v1/issues")]
    public class IssueController : ControllerBase
    {
        private readonly IIssueService _issueService;

        public IssueController(IIssueService issueService)
        {
            _issueService = issueService;
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<List<ProjectIssue>>> GetProjectIssuesByProjectId(int projectId)
        {
            var projectIssues = await _issueService.GetProjectIssuesByProjectIdAsync(projectId);
            return Ok(projectIssues);
        }

        [HttpGet("work/{workId}")]
        public async Task<ActionResult<List<WorkIssue>>> GetWorkIssuesByWorkId(int workId)
        {
            var workIssues = await _issueService.GetWorkIssuesByWorkIdAsync(workId);
            return Ok(workIssues);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateIssue([FromBody] CreateIssueDTO createIssueDTO)
        {
            var issueId = await _issueService.CreateIssueAsync(createIssueDTO);
            return CreatedAtRoute("", new { id = issueId });
        }

        [HttpPut]
        public async Task<ActionResult<int>> UpdateIssue([FromBody] UpdateIssueDTO updateIssueDTO)
        {
            var issueId = await _issueService.UpdateIssueAsync(updateIssueDTO);
            return Ok(issueId);
        }

        [HttpDelete("{issueId}/{issueType}")]
        public async Task<ActionResult<int>> DeleteIssue(int issueId, string issueType)
        {
            var deletedIssueId = await _issueService.DeleteIssueAsync(issueId, issueType);
            return Ok(deletedIssueId);
        }
    }
}
