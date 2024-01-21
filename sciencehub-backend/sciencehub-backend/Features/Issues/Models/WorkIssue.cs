using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend.Shared.Enums;

namespace sciencehub_backend.Features.Issues.Models
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
        public string Title { get; set; }

        [Column("description")]
        public string Description  { get; set; }

        [Column("status")]
        public IssueStatus Status { get; set; }

        [Column("public")]
        public bool Public { get; set; }
        
        public ICollection<WorkIssueUser> WorkIssueUsers { get; set; }
    }
}