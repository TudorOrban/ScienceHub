using sciencehub_backend_core.Core.Users.Models;
using sciencehub_backend_core.Core.Users.Services;

using Microsoft.AspNetCore.Mvc;

namespace sciencehub_backend_core.Core.Users.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("small")]
        public async Task<ActionResult<List<UserSmallDTO>>> GetUsersByIdsAsync([FromQuery] List<Guid> userIds)
        {
            return await _userService.GetUsersByIdsAsync(userIds);
        }
    }
}