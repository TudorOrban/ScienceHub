using sciencehub_backend_community.Features.Discussions.Models;

namespace sciencehub_backend_core.Core.Discussions.Repositories
{
    public interface IDiscussionRepository
    {
        Task<List<Discussion>> GetDiscussionsByUserId(Guid userId);
    }
}