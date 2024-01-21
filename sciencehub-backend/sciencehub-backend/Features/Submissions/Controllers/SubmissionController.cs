using Microsoft.AspNetCore.Mvc;
using sciencehub_backend.Features.Submissions.Dto;
using sciencehub_backend.Features.Submissions.Services;

namespace sciencehub_backend.Features.Submissions.Controllers
{
    [ApiController]
    [Route("api/v1/submissions")]
    public class SubmissionController : ControllerBase
    {
        private readonly SubmissionService _submissionService;

        public SubmissionController(SubmissionService submissionService)
        {
            _submissionService = submissionService;
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateSubmission([FromBody] CreateSubmissionDto createSubmissionDto, [FromServices] SanitizerService sanitizerService)
        {
            var submissionId = await _submissionService.CreateSubmissionAsync(createSubmissionDto, sanitizerService);
            return CreatedAtRoute("", new { id = submissionId });
        }
    }
}
