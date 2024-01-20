using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend.Features.Projects.Models;

namespace sciencehub_backend.Features.Works.Models.ProjectWorks
{
    public class ProjectCodeBlock
    {
        [ForeignKey("CodeBlock")]
        [Column("code_block_id")]
        public int CodeBlockId { get; set; }

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }
        
        public CodeBlock CodeBlock { get; set; }
        public Project Project { get; set; }
    }
}
