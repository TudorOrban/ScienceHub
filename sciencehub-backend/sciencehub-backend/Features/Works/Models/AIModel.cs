using sciencehub_backend.Features.Works.Models.ProjectWorks;
using sciencehub_backend.Features.Works.Models.WorkUsers;

namespace sciencehub_backend.Features.Works.Models
{
    public class AIModel : WorkBase
    {

        public ICollection<AIModelUser> AIModelUsers { get; set; }
        public ICollection<ProjectAIModel> ProjectAIModels { get; set; }
    }
}
