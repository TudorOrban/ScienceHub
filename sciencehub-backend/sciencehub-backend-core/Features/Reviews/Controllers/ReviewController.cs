using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Features.Reviews.Dto;
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

        [HttpPost]
        public async Task<ActionResult<int>> CreateReview([FromBody] CreateReviewDto createReviewDto)
        {
            var reviewId = await _reviewService.CreateReviewAsync(createReviewDto);
            return CreatedAtRoute("", new { id = reviewId });
        }
    }
}
