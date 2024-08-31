namespace sciencehub_backend_community.Core.Users.Models
{
    public class UserSmallDTO
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string CreatedAt { get; set; }

        public Guid GuidId => Guid.Parse(Id);
    }
}