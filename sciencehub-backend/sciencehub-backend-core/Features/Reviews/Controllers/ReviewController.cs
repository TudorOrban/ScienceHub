using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Features.Reviews.Services;

namespace sciencehub_backend_core.Features.Reviews.Controllers
{
    [ApiController]
    [Route("api/v1/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<List<ProjectReview>>> GetProjectReviewsByProjectId(int projectId)
        {
            var projectReviews = await _reviewService.GetProjectReviewsByProjectIdAsync(projectId);
            return Ok(projectReviews);
        }

        [HttpGet("work/{workId}")]
        public async Task<ActionResult<List<WorkReview>>> GetWorkReviewsByWorkId(int workId)
        {
            var workReviews = await _reviewService.GetWorkReviewsByWorkIdAsync(workId);
            return Ok(workReviews);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateReview([FromBody] CreateReviewDTO createReviewDto)
        {
            var reviewId = await _reviewService.CreateReviewAsync(createReviewDto);
            return CreatedAtRoute("", new { id = reviewId });
        }

        [HttpPut]
        public async Task<ActionResult<int>> UpdateReview([FromBody] UpdateReviewDTO updateReviewDto)
        {
            var reviewId = await _reviewService.UpdateReviewAsync(updateReviewDto);
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
