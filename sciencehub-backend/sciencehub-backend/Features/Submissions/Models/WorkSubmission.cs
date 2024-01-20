using sciencehub_backend.Shared.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Features.Submissions.Models
{
    [Table("work_submissions")]
    public class WorkSubmission
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("work_id")]
        public int WorkId { get; set; }

        [Column("work_type")]
        public WorkType WorkType { get; set; }

        [Column("initial_work_version_id")]
        public int InitialWorkVersionId { get; set; }
        
        [Column("final_work_version_id")]
        public int FinalWorkVersionId { get; set; }

        [Column("status")]
        public SubmissionStatus Status { get; set; }

        [Column("title")]
        public string Title { get; set; }

        [Column("description")]
        public string Description  { get; set; }

        [Column("public")]
        public bool Public { get; set; }

        public ICollection<ProjectWorkSubmission> ProjectWorkSubmissions { get; set; }
        public ICollection<WorkSubmissionUser> WorkSubmissionUsers { get; set; }
    }
}
