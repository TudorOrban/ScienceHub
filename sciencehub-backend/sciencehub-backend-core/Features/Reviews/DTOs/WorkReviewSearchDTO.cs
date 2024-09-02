using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.Reviews.DTOs
{
    public class WorkReviewSearchDTO
    {
        public int Id { get; set; }
        public int? WorkId { get; set; }
        public WorkType WorkType { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public ReviewStatus? Status { get; set; }        
        public List<WorkReviewUser> WorkReviewUsers { get; set; } = new List<WorkReviewUser>();
    }
}