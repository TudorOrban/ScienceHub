using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Features.Projects.Models;

namespace sciencehub_backend_core.Features.Works.Models.ProjectWorks
{
    public class ProjectDataAnalysis
    {
        [ForeignKey("DataAnalysis")]
        [Column("data_analysis_id")]
        public int DataAnalysisId { get; set; }

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }
        
        public DataAnalysis DataAnalysis { get; set; }
        public Project Project { get; set; }
    }
}
