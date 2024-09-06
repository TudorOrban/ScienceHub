using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace sciencehub_backend_core.Features.Projects.Models
{
    [Owned]
    public class ProjectMetadata
    {
        [Column("license")]
        public string? License { get; set; }

        [Column("publisher")]
        public string? Publisher { get; set; }

        [Column("conference")]
        public string? Conference { get; set; }

        [Column("research_grants")]
        public string?[] ResearchGrants { get; set; } = Array.Empty<string>();

        [Column("tags")]
        public string?[] Tags { get; set; } = Array.Empty<string>();

        [Column("keywords")]
        public string?[] Keywords { get; set; } = Array.Empty<string>();
    }
}