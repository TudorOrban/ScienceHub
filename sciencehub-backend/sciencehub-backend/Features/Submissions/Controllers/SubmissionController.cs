﻿using Microsoft.AspNetCore.Mvc;
using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Features.Submissions.Dto;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Submissions.Services;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Services;
using sciencehub_backend.Features.Works.Models;

namespace sciencehub_backend.Features.Submissions.Controllers
{
    [ApiController]
    [Route("api/v1/submissions")]
    public class SubmissionController : ControllerBase
    {
        private readonly SubmissionService _submissionService;
        private readonly ProjectSubmissionChangeService _projectSubmissionChangeService;
        private readonly WorkSubmissionChangeService _workSubmissionChangeService;

        public SubmissionController(SubmissionService submissionService, ProjectSubmissionChangeService projectSubmissionChangeService, WorkSubmissionChangeService workSubmissionChangeService)
        {
            _submissionService = submissionService;
            _projectSubmissionChangeService = projectSubmissionChangeService;
            _workSubmissionChangeService = workSubmissionChangeService;
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
                // Handle other potential exceptions
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateSubmission([FromBody] CreateSubmissionDto createSubmissionDto, [FromServices] SanitizerService sanitizerService)
        {
            var submissionId = await _submissionService.CreateSubmissionAsync(createSubmissionDto, sanitizerService);
            return CreatedAtRoute("", new { id = submissionId });
        }
    }
}