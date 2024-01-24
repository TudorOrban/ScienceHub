namespace sciencehub_backend.Core.Users.Models
{
    public class WorkUserDto
    {
        public Guid UserId { get; set; }
        public string Role { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
    }
}