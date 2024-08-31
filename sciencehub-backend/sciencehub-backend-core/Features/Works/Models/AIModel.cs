using sciencehub_backend_core.Features.Works.Models.ProjectWorks;
using sciencehub_backend_core.Features.Works.Models.WorkUsers;

namespace sciencehub_backend_core.Features.Works.Models
{
    public class AIModel : WorkBase
    {

        public ICollection<AIModelUser> AIModelUsers { get; set; }
        public ICollection<ProjectAIModel> ProjectAIModels { get; set; }
    }
}
