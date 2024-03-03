using Microsoft.AspNetCore.Mvc;
using sciencehub_backend.Features.Issues.Dto;
using sciencehub_backend.Features.Issues.Services;

namespace sciencehub_backend.Features.Issues.Controllers
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

        [HttpPost]
        public async Task<ActionResult<int>> CreateIssue([FromBody] CreateIssueDto createIssueDto, [FromServices] SanitizerService sanitizerService)
        {
            var issueId = await _issueService.CreateIssueAsync(createIssueDto, sanitizerService);
            return CreatedAtRoute("", new { id = issueId });
        }
    }
}
