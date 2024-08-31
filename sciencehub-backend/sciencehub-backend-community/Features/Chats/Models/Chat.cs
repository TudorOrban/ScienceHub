using sciencehub_backend_community.Core.Models;

namespace sciencehub_backend_community.Features.Chats.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public List<User>? Users { get; set; }
        public List<ChatMessage>? ChatMessages { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? Link { get; set; }
    }

    public class ChatMessage
    {
        public int Id { get; set; }
        public int ChatId { get; set; }
        public string? UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Content { get; set; }
    }
}