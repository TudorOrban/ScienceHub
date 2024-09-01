using System.ComponentModel.DataAnnotations;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.Reviews.DTOs
{
    public class ProjectReviewSearchDTO
    {
        public int Id { get; set; }
        public int? ProjectId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public ReviewStatus? Status { get; set; }        
        public List<ProjectReviewUser> ProjectReviewUsers { get; set; } = new List<ProjectReviewUser>();
    }
}