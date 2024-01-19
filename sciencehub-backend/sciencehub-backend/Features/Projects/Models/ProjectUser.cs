using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Features.Projects.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Features.Projects.Models
{
    public class ProjectUser
    {
        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [Column("role")]
        public string Role { get; set; }

        public Project Project { get; set; }
        public User User { get; set; }
    }
}