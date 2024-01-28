using Microsoft.AspNetCore.Mvc;
using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Features.Submissions.Dto;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Submissions.Services;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Services;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Shared.Enums;

namespace sciencehub_backend.Features.Submissions.Controllers
{
    [ApiController]
    [Route("api/v1/submissions")]
    public class SubmissionController : ControllerBase
    {
        private readonly SubmissionService _submissionService;
        private readonly ProjectSubmissionChangeService _projectSubmissionChangeService;
        private readonly WorkSubmissionChangeService _workSubmissionChangeService;
        private readonly WorkReconstructionService _workReconstructionService;

        public SubmissionController(SubmissionService submissionService, ProjectSubmissionChangeService projectSubmissionChangeService, WorkSubmissionChangeService workSubmissionChangeService, WorkReconstructionService workReconstructionService)
        {
            _submissionService = submissionService;
            _projectSubmissionChangeService = projectSubmissionChangeService;
            _workSubmissionChangeService = workSubmissionChangeService;
            _workReconstructionService = workReconstructionService;
        }

        [HttpPost("work-submissions/{id}/accept")]
        public async Task<ActionResult<WorkSubmission>> AcceptWorkSubmission([FromRoute] int id, [FromBody] string currentUserId)
        {
            var workSubmission = await _workSubmissionChangeService.AcceptWorkSubmissionAsync(id, currentUserId);
            return Ok(workSubmission);
        }

        [HttpPost("project-submissions/{id}/accept")]
        public async Task<ActionResult<List<WorkUserDto>>> AcceptProjectSubmission([FromRoute] int id, [FromBody] string currentUserId)
        {
            var projectSubmission = await _projectSubmissionChangeService.AcceptProjectSubmissionAsync(id, currentUserId);
            return Ok(projectSubmission);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WorkSubmission>> GetSubmission(int id)
        {
            try
            {
                var submission = await _submissionService.GetWorkSubmissionAsync(id);
                return Ok(submission);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateSubmission([FromBody] CreateSubmissionDto createSubmissionDto, [FromServices] SanitizerService sanitizerService)
        {
            var submissionId = await _submissionService.CreateSubmissionAsync(createSubmissionDto, sanitizerService);
            return CreatedAtRoute("", new { id = submissionId });
        }

        [HttpGet("work-versions")]
        public async Task<ActionResult<WorkSubmission>> GetWorkByVersionId([FromBody] GetWorkVersionDto getWorkVersionDto)
        {
            try
            {
                var work = await _workReconstructionService.FindWorkVersionData(getWorkVersionDto.WorkId, getWorkVersionDto.WorkType, getWorkVersionDto.VersionId);
                return Ok(work);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
