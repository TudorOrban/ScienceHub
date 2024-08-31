using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Core.Users.Models;

namespace sciencehub_backend_core.Features.Reviews.Models
{
    public class WorkReviewUser
    {
        [ForeignKey("WorkReview")]
        [Column("work_review_id")]
        public int WorkReviewId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        public WorkReview WorkReview { get; set; }
        public User User { get; set; }
    }
}
