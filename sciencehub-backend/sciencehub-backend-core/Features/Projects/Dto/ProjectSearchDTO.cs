
namespace sciencehub_backend_core.Features.Projects.Services
{
    public class ProjectSearchDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<ProjectUserDTO> ProjectUsers { get; set; } = new List<ProjectUserDTO>();

    }

    public class ProjectUserDTO
    {
        public int ProjectId { get; set; }
        public Guid UserId { get; set; }
        public string Role { get; set; } = string.Empty;
        public UserDTO? User { get; set; }
    }

    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? FullName { get; set; }
    }
}