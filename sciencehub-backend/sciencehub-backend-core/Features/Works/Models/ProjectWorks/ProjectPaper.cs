using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Features.Projects.Models;

namespace sciencehub_backend_core.Features.Works.Models.ProjectWorks
{
    public class ProjectPaper
    {
        [ForeignKey("Paper")]
        [Column("paper_id")]
        public int PaperId { get; set; }

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }
        
        public Paper Paper { get; set; }
        public Project Project { get; set; }
    }
}
