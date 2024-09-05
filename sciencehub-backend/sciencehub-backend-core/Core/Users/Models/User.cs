using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Features.Projects.Models;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Features.Submissions.Models;
using sciencehub_backend_core.Features.Works.Models.WorkUsers;
using sciencehub_backend_core.Features.NewWorks.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend_core.Core.Users.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("username")]
        public string Username { get; set; } = string.Empty;

        [Column("full_name")]
        public string? FullName { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        public ICollection<ProjectUser> ProjectUsers { get; set; } = new List<ProjectUser>();
        public ICollection<PaperUser> PaperUsers { get; set; } = new List<PaperUser>();
        public ICollection<ExperimentUser> ExperimentUsers { get; set; } = new List<ExperimentUser>();
        public ICollection<DatasetUser> DatasetUsers { get; set; } = new List<DatasetUser>();
        public ICollection<DataAnalysisUser> DataAnalysisUsers { get; set; } = new List<DataAnalysisUser>();
        public ICollection<AIModelUser> AIModelUsers { get; set; } = new List<AIModelUser>();
        public ICollection<CodeBlockUser> CodeBlockUsers { get; set; } = new List<CodeBlockUser>();
        public ICollection<ProjectSubmissionUser> ProjectSubmissionUsers { get; set; } = new List<ProjectSubmissionUser>();
        public ICollection<WorkSubmissionUser> WorkSubmissionUsers { get; set; } = new List<WorkSubmissionUser>();
        public ICollection<ProjectIssueUser> ProjectIssueUsers { get; set; } = new List<ProjectIssueUser>();
        public ICollection<WorkIssueUser> WorkIssueUsers { get; set; } = new List<WorkIssueUser>();
        public ICollection<ProjectReviewUser> ProjectReviewUsers { get; set; } = new List<ProjectReviewUser>();
        public ICollection<WorkReviewUser> WorkReviewUsers { get; set; } = new List<WorkReviewUser>();
        
        // New Works
        public ICollection<WorkUser> WorkUsers { get; set; } = new List<WorkUser>();
    }
}
