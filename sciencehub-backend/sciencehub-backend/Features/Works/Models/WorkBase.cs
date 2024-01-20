using sciencehub_backend.Features.Projects.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Features.Works.Models
{
    public abstract class WorkBase
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("work_type")]
        public string WorkType { get; set; }

        [Column("title")]
        public string Title { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("research_score")]
        public int? ResearchScore { get; set; }

        [Column("link")]
        public string Link { get; set; }

        [Column("public")]
        public bool? Public { get; set; }

        [Column("current_work_version_id")]
        public int? CurrentWorkVersionId { get; set; }

    }
}
