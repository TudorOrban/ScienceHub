using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Works.Models.WorkUsers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Core.Users.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("username")]
        public string Username { get; set; }

        [Column("full_name")]
        public string FullName { get; set; }

        public ICollection<ProjectUser> ProjectUsers { get; set; }
        public ICollection<PaperUser> PaperUsers { get; set; }
        public ICollection<ExperimentUser> ExperimentUsers { get; set; }
        public ICollection<DatasetUser> DatasetUsers { get; set; }
        public ICollection<DataAnalysisUser> DataAnalysisUsers { get; set; }
        public ICollection<AIModelUser> AIModelUsers { get; set; }
        public ICollection<CodeBlockUser> CodeBlockUsers { get; set; }
        public ICollection<ProjectSubmissionUser> ProjectSubmissionUsers { get; set; }
        public ICollection<WorkSubmissionUser> WorkSubmissionUsers { get; set; }
    }
}
