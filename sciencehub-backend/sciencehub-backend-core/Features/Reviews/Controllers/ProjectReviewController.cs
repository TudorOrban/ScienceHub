using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Features.Reviews.Services;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Reviews.Controllers
{
    [ApiController]
    [Route("api/v1/project-reviews")]
    public class ProjectReviewController : ControllerBase
    {
        private readonly IProjectReviewService _projectReviewService;

        public ProjectReviewController(IProjectReviewService projectReviewService)
        {
            _projectReviewService = projectReviewService;
        }

        [HttpGet("{id}/project")]
        public async Task<ActionResult<ProjectReview>> GetProjectReview(int id)
        {
            var projectReview = await _projectReviewService.GetProjectReviewByIdAsync(id);
            return Ok(projectReview);
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<List<ProjectReview>>> GetProjectReviewsByProjectId(int projectId)
        {
            var projectReviews = await _projectReviewService.GetProjectReviewsByProjectIdAsync(projectId);
            return Ok(projectReviews);
        }

        [HttpGet("project/{projectId}/search")]
        public async Task<ActionResult<PaginatedResults<ProjectReviewSearchDTO>>> SearchProjectReviewsByProjectId(
            int projectId,
            [FromQuery] string searchTerm = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "Name",
            [FromQuery] bool sortDescending = false)
        {
            SearchParams searchParams = new SearchParams { SearchQuery = searchTerm, Page = page, ItemsPerPage = pageSize, SortBy = sortBy, SortDescending = sortDescending };
            
            var projectReviews = await _projectReviewService.SearchProjectReviewsByProjectIdAsync(projectId, searchParams);

            return Ok(projectReviews);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateReview([FromBody] CreateReviewDTO createReviewDTO)
        {
            var reviewId = await _projectReviewService.CreateProjectReviewAsync(createReviewDTO);
            return CreatedAtRoute("", new { id = reviewId });
        }

        [HttpPut]
        public async Task<ActionResult<int>> UpdateReview([FromBody] UpdateReviewDTO updateReviewDTO)
        {
            var reviewId = await _projectReviewService.UpdateProjectReviewAsync(updateReviewDTO);
            return Ok(reviewId);
        }

        [HttpDelete("{reviewId}")]
        public async Task<ActionResult<int>> DeleteReview(int reviewId)
        {
            var deletedReviewId = await _projectReviewService.DeleteProjectReviewAsync(reviewId);
            return Ok(deletedReviewId);
        }
    }
}
