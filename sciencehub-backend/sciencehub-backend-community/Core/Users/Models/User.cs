namespace sciencehub_backend_community.Core.Users.Models
{
    public class User 
    {
        public string Id { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? FullName { get; set; }
    }
}