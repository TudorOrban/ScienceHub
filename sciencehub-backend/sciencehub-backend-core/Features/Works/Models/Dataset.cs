using sciencehub_backend_core.Features.Works.Models.ProjectWorks;
using sciencehub_backend_core.Features.Works.Models.WorkUsers;

namespace sciencehub_backend_core.Features.Works.Models
{
    public class Dataset : WorkBase
    {
        public ICollection<DatasetUser> DatasetUsers { get; set; }
        public ICollection<ProjectDataset> ProjectDatasets { get; set; }
    }
}
