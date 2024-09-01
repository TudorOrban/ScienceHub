using System.ComponentModel.DataAnnotations;

namespace sciencehub_backend_core.Features.Projects.DTO
{
    public class CreateProjectDTO
    {
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, ErrorMessage = "Title must be less than 100 characters long.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name must be less than 100 characters long.")]
        [RegularExpression(@"^[^\\/~]*$", ErrorMessage = "The name cannot contain backslashes, slashes or tildes")]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Required(ErrorMessage = "At least one user is required.")]
        public List<string> Users { get; set; }

        [Required(ErrorMessage = "Link is required")]
        public string Link { get; set; }

        public bool Public { get; set; }
    }
}
