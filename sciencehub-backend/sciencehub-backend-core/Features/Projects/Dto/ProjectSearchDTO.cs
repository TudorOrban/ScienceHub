
namespace sciencehub_backend_core.Features.Projects.Services
{
    public class ProjectSearchDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<ProjectUserDTO> ProjectUsers { get; set; }

    }

    public class ProjectUserDTO
    {
        public int ProjectId { get; set; }
        public Guid UserId { get; set; }
        public string Role { get; set; }
        public UserDTO User { get; set; }
    }

    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string? FullName { get; set; }
    }
}