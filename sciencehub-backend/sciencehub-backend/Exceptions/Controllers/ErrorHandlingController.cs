using Microsoft.AspNetCore.Mvc;

namespace sciencehub_backend.Exceptions.Controllers
{
    [ApiController]
    [Route("/api/v1/error")]
    public class ErrorHandlingController : ControllerBase
    {

        [Route("invalid-user-id")]
        [HttpGet]
        public IActionResult HandleInvalidUserId()
        {
            var errorMessage = "Invalid user ID provided.";
            var problemDetails = new ProblemDetails
            {
                Title = "Invalid User ID",
                Detail = errorMessage,
                Status = 400
            };
            return BadRequest(problemDetails);
        }

        [Route("other-error")]
        [HttpGet]
        public IActionResult HandleOtherError()
        {
            var errorMessage = "An unexpected error occurred.";
            var problemDetails = new ProblemDetails
            {
                Title = "Internal Server Error",
                Detail = errorMessage,
                Status = 500,
            };
            return StatusCode(500, problemDetails);
        }
    }
}
