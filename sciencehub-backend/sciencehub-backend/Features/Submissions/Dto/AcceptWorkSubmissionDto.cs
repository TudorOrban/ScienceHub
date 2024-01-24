using System.ComponentModel.DataAnnotations;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Shared.Enums;

namespace sciencehub_backend.Features.Submissions.Dto
{
    public class AcceptWorkSubmissionDto
    {
        [Required(ErrorMessage = "Submission is required.")]
        public WorkSubmission Submission { get; set; }
    }
}