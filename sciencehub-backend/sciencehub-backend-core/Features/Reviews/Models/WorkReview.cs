using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.Reviews.Models
{
    [Table("work_reviews")]
    public class WorkReview
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("work_id")]
        public int WorkId { get; set; }

        [Column("work_type")]
        public WorkType WorkType { get; set; }

        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("description")]
        public string? Description  { get; set; }

        [Column("content")]
        public string? Content  { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("status")]
        public ReviewStatus Status { get; set; }

        [Column("public")]
        public bool Public { get; set; }
        
        public ICollection<WorkReviewUser> WorkReviewUsers { get; set; } = new List<WorkReviewUser>();
    }
}