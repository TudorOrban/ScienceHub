namespace sciencehub_backend_community.Core.Users.Models
{
    public class UserSmallDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? CreatedAt { get; set; }

        public Guid GuidId => Guid.Parse(Id);
    }
}