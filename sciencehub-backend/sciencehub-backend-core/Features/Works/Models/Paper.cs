using sciencehub_backend_core.Features.Works.Models.ProjectWorks;
using sciencehub_backend_core.Features.Works.Models.WorkUsers;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend_core.Features.Works.Models
{
    public class Paper : WorkBase
    {
        [Column("abstract")]
        public string? Abstract { get; set; }

        public ICollection<PaperUser> PaperUsers { get; set; }
        public ICollection<ProjectPaper> ProjectPapers { get; set; }
    }
}
