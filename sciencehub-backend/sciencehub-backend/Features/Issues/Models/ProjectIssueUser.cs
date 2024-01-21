using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend.Core.Users.Models;

namespace sciencehub_backend.Features.Issues.Models
{
    public class ProjectIssueUser
    {
        [ForeignKey("ProjectIssue")]
        [Column("project_issue_id")]
        public int ProjectIssueId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        public ProjectIssue ProjectIssue { get; set; }
        public User User { get; set; }
    }
}
