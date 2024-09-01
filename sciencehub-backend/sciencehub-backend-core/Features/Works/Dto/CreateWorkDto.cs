using System.ComponentModel.DataAnnotations;

namespace sciencehub_backend_core.Features.Works.DTO
{
    public class CreateWorkDTO
    {
        [Required(ErrorMessage = "Work Type is required.")]
        public string WorkType { get; set; }

        public int? ProjectId { get; set; }
        public int? SubmissionId { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, ErrorMessage = "Title must be less than 100 characters long.")]
        public string Title { get; set; }

        public string? Description { get; set; }

        [Required(ErrorMessage = "At least one user is required.")]
        public List<string> Users { get; set; }

        public bool Public { get; set; }
    }
}
