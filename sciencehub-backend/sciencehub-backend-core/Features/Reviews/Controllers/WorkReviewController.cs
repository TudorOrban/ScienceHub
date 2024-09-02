using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Features.Reviews.Services;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Reviews.Controllers
{
    [ApiController]
    [Route("api/v1/work-reviews")]
    public class WorkReviewController : ControllerBase
    {
        private readonly IWorkReviewService _workReviewService;

        public WorkReviewController(IWorkReviewService workReviewService)
        {
            _workReviewService = workReviewService;
        }

        [HttpGet("{id}/work")]
        public async Task<ActionResult<WorkReview>> GetWorkReview(int id)
        {
            var workReview = await _workReviewService.GetWorkReviewByIdAsync(id);
            return Ok(workReview);
        }
        
        [HttpGet("work/{workId}/{workTypeString}")]
        public async Task<ActionResult<List<WorkReview>>> GetWorkReviewsByWorkId(int workId, string workTypeString)
        {
            var workType = Enum.Parse<WorkType>(workTypeString);
            var workReviews = await _workReviewService.GetWorkReviewsByWorkIdAsync(workId, workType);
            return Ok(workReviews);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateReview([FromBody] CreateReviewDTO createReviewDTO)
        {
            var reviewId = await _workReviewService.CreateWorkReviewAsync(createReviewDTO);
            return CreatedAtRoute("", new { id = reviewId });
        }

        [HttpPut]
        public async Task<ActionResult<int>> UpdateReview([FromBody] UpdateReviewDTO updateReviewDTO)
        {
            var reviewId = await _workReviewService.UpdateWorkReviewAsync(updateReviewDTO);
            return Ok(reviewId);
        }

        [HttpDelete("{reviewId}")]
        public async Task<ActionResult<int>> DeleteReview(int reviewId)
        {
            var deletedReviewId = await _workReviewService.DeleteWorkReviewAsync(reviewId);
            return Ok(deletedReviewId);
        }
    }
}
