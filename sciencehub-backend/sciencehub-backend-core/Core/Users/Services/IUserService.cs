
using sciencehub_backend_core.Core.Users.DTOs;

namespace sciencehub_backend_core.Core.Users.Services
{
    public interface IUserService
    {
        Task<List<UserSmallDTO>> GetUsersByIdsAsync(List<Guid> userIds);
    }
}