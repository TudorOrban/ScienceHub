using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Core.Users.Models;

namespace sciencehub_backend_core.Features.Reviews.Models
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
