using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend.Core.Users.Models;

namespace sciencehub_backend.Features.Reviews.Models
{
    public class ProjectReviewUser
    {
        [ForeignKey("ProjectReview")]
        [Column("project_review_id")]
        public int ProjectReviewId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        public ProjectReview ProjectReview { get; set; }
        public User User { get; set; }
    }
}
