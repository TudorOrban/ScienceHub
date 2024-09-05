using System.ComponentModel.DataAnnotations;

namespace sciencehub_backend_core.Features.NewWorks.DTOs
{
    public class UpdateWorkDTO
    {
        [Required]
        public int Id { get; set; }
        public string WorkType { get; set; } = string.Empty;

        public int? ProjectId { get; set; }
        public int? SubmissionId { get; set; }

        [StringLength(100, ErrorMessage = "Title must be less than 100 characters long.")]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public List<string> Users { get; set; } = new List<string>();

        public bool Public { get; set; }
    }
}
