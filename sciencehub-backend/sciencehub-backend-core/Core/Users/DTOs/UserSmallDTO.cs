namespace sciencehub_backend_core.Core.Users.Models
{
    public class UserSmallDTO
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? CreatedAt { get; set; }
    }
}