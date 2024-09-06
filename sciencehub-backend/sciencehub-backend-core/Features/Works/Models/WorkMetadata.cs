using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace sciencehub_backend_core.Features.Works.Models
{
    [Owned]
    public class WorkMetadataNew
    {
        [Column("license")]
        public string? License { get; set; }

        [Column("publisher")]
        public string? Publisher { get; set; }

        [Column("conference")]
        public string? Conference { get; set; }

        [Column("research_grants")]
        public string?[] ResearchGrants { get; set; } = [];

        [Column("tags")]
        public string?[] Tags { get; set; } = [];

        [Column("keywords")]
        public string?[] Keywords { get; set; } = [];
    }
}