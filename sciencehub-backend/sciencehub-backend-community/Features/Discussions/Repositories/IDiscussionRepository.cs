using sciencehub_backend_core.Core.Discussions.DTOs;

namespace sciencehub_backend_core.Core.Discussions.Repositories
{
    public interface IDiscussionRepository
    {
        Task<List<DiscussionSearchDTO>> GetDiscussionsByUserId(Guid userId);
    }
}