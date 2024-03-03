﻿using Microsoft.AspNetCore.Mvc;
using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Features.Submissions.Dto;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Submissions.Services;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Services;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Services;

namespace sciencehub_backend.Features.Submissions.Controllers
{
    [ApiController]
    [Route("api/v1/submissions")]
    public class SubmissionController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;
        private readonly IProjectSubmissionAcceptService _projectSubmissionAcceptService;
        private readonly ISubmissionSubmitService _submissionSubmitService;
        private readonly IWorkSubmissionAcceptService _workSubmissionAcceptService;
        private readonly IWorkReconstructionService _workReconstructionService;

        public SubmissionController(ISubmissionService submissionService, ISubmissionSubmitService submissionSubmitService, IProjectSubmissionAcceptService projectSubmissionAcceptService, IWorkSubmissionAcceptService workSubmissionAcceptService, IWorkReconstructionService workReconstructionService)
        {
            _submissionService = submissionService;
            _submissionSubmitService = submissionSubmitService;
            _projectSubmissionAcceptService = projectSubmissionAcceptService;
            _workSubmissionAcceptService = workSubmissionAcceptService;
            _workReconstructionService = workReconstructionService;
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

        // Create
        [HttpPost]
        public async Task<ActionResult<int>> CreateSubmission([FromBody] CreateSubmissionDto createSubmissionDto)
        {
            var submissionId = await _submissionService.CreateSubmissionAsync(createSubmissionDto);
            return CreatedAtRoute("", new { id = submissionId });
        }

        // Submit and accept
        [HttpPost("work-submissions/{submissionId}/submit")]
        public async Task<ActionResult<WorkSubmission>> SubmitWorkSubmission([FromRoute] int submissionId, [FromBody] string currentUserId)
        {
            var workSubmission = await _submissionSubmitService.SubmitWorkSubmissionAsync(submissionId, currentUserId);
            return Ok(workSubmission);
        }

        // [HttpPost("project-submissions/{id}/accept")]
        // public async Task<ActionResult<List<WorkUserDto>>> AcceptProjectSubmission([FromRoute] int id, [FromBody] string currentUserId)
        // {
        //     var projectSubmission = await _projectSubmissionAcceptService.AcceptProjectSubmissionAsync(id, currentUserId);
        //     return Ok(projectSubmission);
        // }

        [HttpPost("work-submissions/{submissionId}/accept")]
        public async Task<ActionResult<WorkSubmission>> AcceptWorkSubmission([FromRoute] int submissionId, [FromBody] string currentUserId)
        {
            var workSubmission = await _workSubmissionAcceptService.AcceptWorkSubmissionAsync(submissionId, currentUserId);
            return Ok(workSubmission);
        }

        [HttpPost("project-submissions/{submissionId}/accept")]
        public async Task<ActionResult<List<WorkUserDto>>> AcceptProjectSubmission([FromRoute] int submissionId, [FromBody] string currentUserId)
        {
            var projectSubmission = await _projectSubmissionAcceptService.AcceptProjectSubmissionAsync(submissionId, currentUserId);
            return Ok(projectSubmission);
        }

        // Work version reconstruction
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
