using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Core.Discussions.DTOs;
using sciencehub_backend_core.Core.Discussions.Services;

namespace sciencehub_backend_core.Core.Discussions.Controllers
{
    [ApiController]
    [Route("api/v1/discussions")]
    public class DiscussionController : ControllerBase
    {
        private readonly IDiscussionService _discussionService;

        public DiscussionController(IDiscussionService discussionService)
        {
            _discussionService = discussionService;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<DiscussionSearchDTO>>> GetDiscussionsByUserId(Guid userId)
        {
            return await _discussionService.GetDiscussionsByUserId(userId);
        }
    }
}