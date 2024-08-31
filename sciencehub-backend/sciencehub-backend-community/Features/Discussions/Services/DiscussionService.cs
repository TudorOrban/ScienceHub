using sciencehub_backend_core.Core.Discussions.DTOs;
using sciencehub_backend_core.Core.Discussions.Repositories;

namespace sciencehub_backend_core.Core.Discussions.Services
{
    public class DiscussionService : IDiscussionService
    {
        private readonly IDiscussionRepository _discussionRepository;

        public DiscussionService(IDiscussionRepository discussionRepository)
        {
            _discussionRepository = discussionRepository;
        }

        public async Task<List<DiscussionSearchDTO>> GetDiscussionsByUserId(Guid userId) {
            var discussions = await _discussionRepository.GetDiscussionsByUserId(userId);
            return discussions.Select(d => new DiscussionSearchDTO
            {
                Id = d.Id,
                Title = d.Title,
                Content = d.Content,
                CreatedAt = d.CreatedAt,
                UserId = d.UserId
            }).ToList();
        }
    }
}