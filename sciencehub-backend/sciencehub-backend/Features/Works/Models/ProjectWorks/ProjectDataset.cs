using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend.Features.Projects.Models;

namespace sciencehub_backend.Features.Works.Models.ProjectWorks
{
    public class ProjectDataset
    {
        [ForeignKey("Dataset")]
        [Column("dataset_id")]
        public int DatasetId { get; set; }

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }
        
        public Dataset Dataset { get; set; }
        public Project Project { get; set; }
    }
}
