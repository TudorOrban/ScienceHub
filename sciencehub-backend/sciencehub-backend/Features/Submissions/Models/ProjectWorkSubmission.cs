using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Features.Submissions.Models
{
    public class ProjectWorkSubmission
    {
        [ForeignKey("ProjectSubmission")]
        [Column("project_submission_id")]
        public int ProjectSubmissionId { get; set; }

        [ForeignKey("WorkSubmission")]
        [Column("work_submission_id")]
        public int WorkSubmissionId { get; set; }

        public ProjectSubmission ProjectSubmission { get; set; }
        public WorkSubmission WorkSubmission { get; set; }
    }
}
