using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Features.Projects.Models;

namespace sciencehub_backend_core.Features.NewWorks.Models
{
    public class ProjectWork
    {
        [ForeignKey("Work")]
        [Column("work_id")]
        public int WorkId { get; set; }

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }
        
        public Work Work { get; set; }
        public Project Project { get; set; } 
    }

}