using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend_core.Features.Projects.Models
{
    [Table("project_versions")]
    public class ProjectVersion
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("project_id")]
        public int ProjectId { get; set; }

        public Project Project { get; set; }
    }

}
