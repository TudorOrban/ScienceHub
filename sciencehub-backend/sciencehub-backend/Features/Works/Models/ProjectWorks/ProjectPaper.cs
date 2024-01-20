using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend.Features.Projects.Models;

namespace sciencehub_backend.Features.Works.Models.ProjectWorks
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
