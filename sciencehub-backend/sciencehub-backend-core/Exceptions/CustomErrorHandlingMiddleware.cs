using sciencehub_backend_core.Exceptions.Errors;
using System.Net;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace sciencehub_backend_core.Exceptions
{
    public class CustomErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CustomErrorHandlingMiddleware> _logger;

        public CustomErrorHandlingMiddleware(
            RequestDelegate next,
            ILogger<CustomErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "A database error occurred.");

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "A server error occurred."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
            catch (InvalidUserIdException ex)
            {
                _logger.LogWarning(ex, "Invalid user ID provided");

                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "Invalid user ID provided."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
            catch (InvalidProjectIdException ex)
            {
                _logger.LogWarning(ex, "Invalid project ID provided");

                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "Invalid project ID provided."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
            catch (InvalidWorkIdException ex)
            {
                _logger.LogWarning(ex, "Invalid work ID provided");

                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "Invalid work ID provided."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
            catch (InvalidSubmissionIdException ex)
            {
                _logger.LogWarning(ex, "Invalid submission ID provided");

                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "Invalid submission ID provided."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
            catch (InvalidProjectVersionIdException ex)
            {
                _logger.LogWarning(ex, "Invalid project version ID provided");

                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "Invalid project version ID provided."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
            catch (InvalidWorkTypeException ex)
            {
                _logger.LogWarning(ex, "Invalid Work Type provided");

                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "Invalid Work Type provided."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
            catch (InvalidProjectIssueIdException ex)
            {
                _logger.LogWarning(ex, "Invalid project issue ID provided");

                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "Invalid project issue ID provided."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
            catch (InvalidWorkIssueIdException ex)
            {
                _logger.LogWarning(ex, "Invalid work issue ID provided");

                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "Invalid work issue ID provided."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
            catch (InvalidProjectReviewIdException ex)
            {
                _logger.LogWarning(ex, "Invalid project review ID provided");

                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "Invalid project review ID provided."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
            catch (InvalidWorkReviewIdException ex)
            {
                _logger.LogWarning(ex, "Invalid work review ID provided");

                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "Invalid work review ID provided."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid argument provided");

                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "Invalid argument provided."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
            catch (Exception ex)
            {
                // Generic exception handling
                _logger.LogError(ex, "An unexpected error occurred.");

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "An unexpected error occurred."
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
            }
        }
    }
    
}

public class ErrorResponse
{
    public string Message { get; set; } = null!;
}