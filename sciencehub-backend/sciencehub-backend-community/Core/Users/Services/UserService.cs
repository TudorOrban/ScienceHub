
using System.Text.Json;
using System.Web;
using sciencehub_backend_community.Core.Users.Models;

namespace sciencehub_backend_community.Core.Users.Services
{
    public class UserService : IUserService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly ILogger<UserService> _logger;

        public UserService(IHttpClientFactory clientFactory, ILogger<UserService> logger)
        {
            _clientFactory = clientFactory;
            _logger = logger;
        }

        public async Task<List<UserSmallDTO>> GetUsersByIdsAsync(List<Guid> userIds) 
        {
            var client = _clientFactory.CreateClient("CoreService");

            var query = HttpUtility.ParseQueryString(string.Empty);
            foreach (var id in userIds)
            {
                query.Add("userIds", id.ToString());
            }

            var response = await client.GetAsync($"api/v1/users/small?{query}");
            if (response.IsSuccessStatusCode)
            {
                var rawResponse = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var users = JsonSerializer.Deserialize<List<UserSmallDTO>>(rawResponse, options);
                if (users != null)
                {
                    return users;
                }
                else
                {
                    _logger.LogError("Failed to deserialize users");
                    return new List<UserSmallDTO>();
                }
            }
            else
            {
                var errorResponse = await response.Content.ReadAsStringAsync();
                _logger.LogError("Error fetching users: {StatusCode}, Response: {Response}", response.StatusCode, errorResponse);
                return new List<UserSmallDTO>();
            }
        }
    }
}