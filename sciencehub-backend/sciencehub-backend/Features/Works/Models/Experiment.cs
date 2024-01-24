using sciencehub_backend.Features.Works.Models.ProjectWorks;
using sciencehub_backend.Features.Works.Models.WorkUsers;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Features.Works.Models
{
    public class Experiment : WorkBase
    {
        [Column("objective")]
        public string? Objective { get; set; }

        public ICollection<ExperimentUser> ExperimentUsers { get; set; }
        public ICollection<ProjectExperiment> ProjectExperiments { get; set; }
    }
}
