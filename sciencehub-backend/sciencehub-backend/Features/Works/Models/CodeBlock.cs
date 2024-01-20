using sciencehub_backend.Features.Works.Models.ProjectWorks;
using sciencehub_backend.Features.Works.Models.WorkUsers;

namespace sciencehub_backend.Features.Works.Models
{
    public class CodeBlock : WorkBase
    {

        public ICollection<CodeBlockUser> CodeBlockUsers { get; set; }
        public ICollection<ProjectCodeBlock> ProjectCodeBlocks { get; set; }
    }
}
