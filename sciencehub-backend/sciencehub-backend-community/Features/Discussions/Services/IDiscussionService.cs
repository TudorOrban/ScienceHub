using sciencehub_backend_community.Features.Discussions.DTOs;

namespace sciencehub_backend_community.Features.Discussions.Services
{
    public interface IDiscussionService
    {
        Task<List<DiscussionSearchDTO>> GetDiscussionsByUserId(Guid userId);
    }
}