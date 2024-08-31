using sciencehub_backend_core.Core.Discussions.DTOs;

namespace sciencehub_backend_core.Core.Discussions.Services
{
    public interface IDiscussionService
    {
        Task<List<DiscussionSearchDTO>> GetDiscussionsByUserId(Guid userId);
    }
}