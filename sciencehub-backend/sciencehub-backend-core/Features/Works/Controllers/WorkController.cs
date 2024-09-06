using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Features.Works.DTOs;
using sciencehub_backend_core.Features.Works.Models;
using sciencehub_backend_core.Features.Works.Services;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Works.Controllers
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
        public async Task<ActionResult<IEnumerable<WorkSearchDTO>>> GetWorksByTypeAndUserId(string workTypeString, Guid userId)
        {
            var type = Enum.Parse<WorkType>(workTypeString);
            var works = await _workService.GetWorksByTypeAndUserIdAsync(type, userId);
            return Ok(works);
        }

        [HttpGet("type/{type}/project/{projectId}")]
        public async Task<ActionResult<IEnumerable<WorkSearchDTO>>> GetWorksByTypeAndProjectId(string workTypeString, int projectId)
        {
            var type = Enum.Parse<WorkType>(workTypeString);
            var works = await _workService.GetWorksByTypeAndProjectIdAsync(type, projectId);
            return Ok(works);
        }

        [HttpGet("user/{userIdString}/workType/{workTypeString}/search")]
        public async Task<ActionResult<PaginatedResults<WorkSearchDTO>>> SearchWorkReviewsByWorkId(
            string userIdString,
            string workTypeString,
            [FromQuery] string searchTerm = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "createdAt",
            [FromQuery] bool sortDescending = false)
        {
            WorkType workType = Enum.Parse<WorkType>(workTypeString);
            Guid userId = Guid.Parse(userIdString);
            SearchParams searchParams = new SearchParams { SearchQuery = searchTerm, Page = page, ItemsPerPage = pageSize, SortBy = sortBy, SortDescending = sortDescending };
            
            var works = await _workService.SearchWorksByTypeAndUserIdAsync(userId, workType, searchParams);

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
