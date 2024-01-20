using sciencehub_backend.Features.Works.Models.ProjectWorks;
using sciencehub_backend.Features.Works.Models.WorkUsers;

namespace sciencehub_backend.Features.Works.Models
{
    public class DataAnalysis : WorkBase
    {

        public ICollection<DataAnalysisUser> DataAnalysisUsers { get; set; }
        public ICollection<ProjectDataAnalysis> ProjectDataAnalyses { get; set; }
    }
}
