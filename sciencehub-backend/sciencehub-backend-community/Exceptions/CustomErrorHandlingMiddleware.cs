using System.Net;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace sciencehub_backend_community.Exceptions
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
    
    public class ErrorResponse
    {
        public string Message { get; set; } = null!;
    }
}
