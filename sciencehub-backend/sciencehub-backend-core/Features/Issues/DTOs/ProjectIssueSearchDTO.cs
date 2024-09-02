using System.ComponentModel.DataAnnotations;
using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.Issues.DTOs
{
    public class ProjectIssueSearchDTO
    {
        public int Id { get; set; }
        public int? ProjectId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public IssueStatus? Status { get; set; }        
        public List<ProjectIssueUser> ProjectIssueUsers { get; set; } = new List<ProjectIssueUser>();
    }
}