using sciencehub_backend_community.Core.Users.Models;

namespace sciencehub_backend_community.Core.Users.Services
{
    public interface IUserService
    {
        Task<List<UserSmallDTO>> GetUsersByIdsAsync(List<Guid> userIds);
    }
}