using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Core.Users.Models;

namespace sciencehub_backend_core.Features.Issues.Models
{
    public class WorkIssueUser
    {
        [ForeignKey("WorkIssue")]
        [Column("work_issue_id")]
        public int WorkIssueId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        public WorkIssue WorkIssue { get; set; }
        public User User { get; set; }
    }
}
