using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Features.Projects.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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

        [JsonIgnore]
        public Project Project { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}