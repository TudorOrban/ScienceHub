namespace sciencehub_backend_core.Core.Users.Models
{
    public class WorkUserDTO
    {
        public Guid UserId { get; set; }
        public string Role { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
    }
}