using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Features.Reviews.Services;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Reviews.Controllers
{
    [ApiController]
    [Route("api/v1/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        private readonly IProjectReviewService _projectReviewService;

        public ReviewController(IReviewService reviewService, IProjectReviewService projectReviewService)
        {
            _reviewService = reviewService;
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

        [HttpGet("work/{workId}")]
        public async Task<ActionResult<List<WorkReview>>> GetWorkReviewsByWorkId(int workId)
        {
            var workReviews = await _reviewService.GetWorkReviewsByWorkIdAsync(workId);
            return Ok(workReviews);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateReview([FromBody] CreateReviewDTO createReviewDTO)
        {
            var reviewId = await _reviewService.CreateReviewAsync(createReviewDTO);
            return CreatedAtRoute("", new { id = reviewId });
        }

        [HttpPut]
        public async Task<ActionResult<int>> UpdateReview([FromBody] UpdateReviewDTO updateReviewDTO)
        {
            var reviewId = await _reviewService.UpdateReviewAsync(updateReviewDTO);
            return Ok(reviewId);
        }

        [HttpDelete("{reviewId}/{reviewType}")]
        public async Task<ActionResult<int>> DeleteReview(int reviewId, string reviewType)
        {
            var deletedReviewId = await _reviewService.DeleteReviewAsync(reviewId, reviewType);
            return Ok(deletedReviewId);
        }
    }
}
