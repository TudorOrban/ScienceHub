using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.Issues.Models
{
    [Table("work_issues")]
    public class WorkIssue
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("work_id")]
        public int WorkId { get; set; }

        [Column("work_type")]
        public WorkType WorkType { get; set; }

        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("description")]
        public string? Description  { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
        
        [Column("status")]
        public IssueStatus? Status { get; set; }

        [Column("public")]
        public bool Public { get; set; }
        
        public ICollection<WorkIssueUser> WorkIssueUsers { get; set; } = new List<WorkIssueUser>();
    }
}