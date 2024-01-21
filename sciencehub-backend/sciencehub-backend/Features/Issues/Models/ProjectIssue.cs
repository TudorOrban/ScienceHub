using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend.Shared.Enums;

namespace sciencehub_backend.Features.Issues.Models
{
    [Table("project_issues")]
    public class ProjectIssue
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [ForeignKey("Project")]
        [Column("project_id")]
        public int ProjectId { get; set; }

        [Column("title")]
        public string Title { get; set; }

        [Column("description")]
        public string Description  { get; set; }

        [Column("status")]
        public IssueStatus Status { get; set; }

        [Column("public")]
        public bool Public { get; set; }
        
        public ICollection<ProjectIssueUser> ProjectIssueUsers { get; set; }
    }
}