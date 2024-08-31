using sciencehub_backend_community.Core.Models;
using sciencehub_backend_community.Features.Discussions.Models;

namespace sciencehub_backend_core.Core.Discussions.DTOs
{
    public class DiscussionSearchDTO
    {
        public long Id { get; set; }
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string Title { get; set; }
        public string? Content { get; set; }
        public List<Comment>? DiscussionComments { get; set; }
        public string? Link { get; set; }
    }
}