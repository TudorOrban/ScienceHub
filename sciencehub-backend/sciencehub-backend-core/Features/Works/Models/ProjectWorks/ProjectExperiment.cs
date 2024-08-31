using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Features.Projects.Models;

namespace sciencehub_backend_core.Features.Works.Models.ProjectWorks
{
    public class ProjectExperiment
    {
        [ForeignKey("Experiment")]
        [Column("experiment_id")]
        public int ExperimentId { get; set; }

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }
        
        public Experiment Experiment { get; set; }
        public Project Project { get; set; }
    }
}
