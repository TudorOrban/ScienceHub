using sciencehub_backend_core.Core.Users.Models;
using sciencehub_backend_core.Data;
using Microsoft.EntityFrameworkCore;

namespace sciencehub_backend_core.Core.Users.Services
{
    public class UserService : IUserService
    {
        private readonly CoreServiceDbContext _context;
        private readonly ILogger<UserService> _logger;

        public UserService(CoreServiceDbContext context, ILogger<UserService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<UserSmallDTO>> GetUsersByIdsAsync(List<Guid> userIds)
        {
            try 
            {   
                var users = await _context.Users.Where(u => userIds.Contains(u.Id))
                .Select(u => new UserSmallDTO
                {
                    Id = u.Id,
                    Username = u.Username,
                    FullName = u.FullName,
                    CreatedAt = u.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss")
                })
                .ToListAsync();
                return users;
            } catch (Exception e) {
                _logger.LogError($"Error fetching users in core: {e.Message}");
                throw;
            }
        }
    }
}