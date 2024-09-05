using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Features.NewWorks.DTOs;
using sciencehub_backend_core.Features.NewWorks.Models;
using sciencehub_backend_core.Features.NewWorks.Services;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.NewWorks.Controllers
{
    [ApiController]
    [Route("api/v1/works")]
    public class WorkController : ControllerBase
    {
        private readonly IWorkService _workService;

        public WorkController(IWorkService workService)
        {
            _workService = workService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Work>> GetWork(int id)
        {
            var work = await _workService.GetWorkAsync(id);
            return Ok(work);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<WorkSearchDTO>>> GetWorksByUserId(Guid userId)
        {
            var works = await _workService.GetWorksByUserIdAsync(userId);
            return Ok(works);
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<WorkSearchDTO>>> GetWorksByProjectId(int projectId)
        {
            var works = await _workService.GetWorksByProjectIdAsync(projectId);
            return Ok(works);
        }

        [HttpGet("type/{type}/user/{userId}")]
        public async Task<ActionResult<IEnumerable<WorkSearchDTO>>> GetWorksByTypeAndUserId(String workTypeString, Guid userId)
        {
            var type = Enum.Parse<WorkType>(workTypeString);
            var works = await _workService.GetWorksByTypeAndUserIdAsync(type, userId);
            return Ok(works);
        }

        [HttpGet("type/{type}/project/{projectId}")]
        public async Task<ActionResult<IEnumerable<WorkSearchDTO>>> GetWorksByTypeAndProjectId(String workTypeString, int projectId)
        {
            var type = Enum.Parse<WorkType>(workTypeString);
            var works = await _workService.GetWorksByTypeAndProjectIdAsync(type, projectId);
            return Ok(works);
        }

        [HttpPost]
        public async Task<ActionResult<Work>> CreateWork([FromBody] CreateWorkDTO createWorkDTO)
        {
            var work = await _workService.CreateWorkAsync(createWorkDTO);
            return CreatedAtRoute("", new { id = work.Id }, work);
        }

        [HttpPut]
        public async Task<ActionResult<Work>> UpdateWork([FromBody] UpdateWorkDTO updateWorkDTO)
        {
            var work = await _workService.UpdateWorkAsync(updateWorkDTO);
            return Ok(work);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteWork(int id)
        {
            await _workService.DeleteWorkAsync(id);
            return NoContent();
        }
    }
}
