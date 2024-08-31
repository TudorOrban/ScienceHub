using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.Reviews.Models
{
    [Table("project_reviews")]
    public class ProjectReview
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }

        [Column("title")]
        public string Title { get; set; }

        [Column("description")]
        public string? Description  { get; set; }

        [Column("content")]
        public string? Content  { get; set; }

        [Column("status")]
        public ReviewStatus Status { get; set; }

        [Column("public")]
        public bool Public { get; set; }
        
        public ICollection<ProjectReviewUser> ProjectReviewUsers { get; set; }
    }
}