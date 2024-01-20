using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend.Core.Users.Models;

namespace sciencehub_backend.Features.Submissions.Models
{
    public class WorkSubmissionUser
    {
        [ForeignKey("WorkSubmission")]
        [Column("work_submission_id")]
        public int WorkSubmissionId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        public WorkSubmission WorkSubmission { get; set; }
        public User User { get; set; }
    }
}
