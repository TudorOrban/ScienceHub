using sciencehub_backend.Shared.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Features.Submissions.Models
{
    [Table("project_submissions")]
    public class ProjectSubmission
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }

        [Column("initial_project_version_id")]
        public int InitialProjectVersionId { get; set; }
        
        [Column("final_project_version_id")]
        public int FinalProjectVersionId { get; set; }

        [Column("status")]
        public SubmissionStatus Status { get; set; }

        [Column("title")]
        public string Title { get; set; }

        [Column("description")]
        public string Description  { get; set; }

        [Column("public")]
        public bool Public { get; set; }

        public ICollection<ProjectWorkSubmission> ProjectWorkSubmissions { get; set; }
        public ICollection<ProjectSubmissionUser> ProjectSubmissionUsers { get; set; }
    }
}
