using sciencehub_backend_community.Core.Users.Services;
using sciencehub_backend_community.Features.Discussions.DTOs;
using sciencehub_backend_community.Features.Discussions.Repositories;

namespace sciencehub_backend_community.Features.Discussions.Services
{
    public class DiscussionService : IDiscussionService
    {
        private readonly IDiscussionRepository _discussionRepository;
        private readonly IUserService _userService;
        private readonly ILogger<DiscussionService> _logger;

        public DiscussionService(
            IDiscussionRepository discussionRepository,
            IUserService userService,
            ILogger<DiscussionService> logger
        )
        {
            _discussionRepository = discussionRepository;
            _userService = userService;
            _logger = logger;
        }

        public async Task<List<DiscussionSearchDTO>> GetDiscussionsByUserId(Guid userId) {
            var discussions = await _discussionRepository.GetDiscussionsByUserId(userId);
            
            var userIds = discussions.Select(d => d.UserId).Distinct().ToList();

            var users = await _userService.GetUsersByIdsAsync(userIds);
            
            if (users == null || users.Count == 0) {
                _logger.LogInformation($"No users found for discussions");
                return new List<DiscussionSearchDTO>();
            }

            return discussions.Select(d => new DiscussionSearchDTO
            {
                Id = d.Id,
                Title = d.Title,
                Content = d.Content,
                CreatedAt = d.CreatedAt,
                UserId = d.UserId,
                User = users.Find(u => u.Id == d.UserId.ToString()),
            }).ToList();
        }
    }
}