using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend.Features.Projects.Models;

namespace sciencehub_backend.Features.Works.Models.ProjectWorks
{
    public class ProjectAIModel
    {
        [ForeignKey("AIModel")]
        [Column("ai_model_id")]
        public int AIModelId { get; set; }

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }
        
        public AIModel AIModel { get; set; }
        public Project Project { get; set; }
    }
}
