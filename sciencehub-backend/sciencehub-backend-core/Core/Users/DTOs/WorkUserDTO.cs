namespace sciencehub_backend_core.Core.Users.Models
{
    public class WorkUserDTO
    {
        public Guid UserId { get; set; }
        public string Role { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? FullName { get; set; }
    }
}