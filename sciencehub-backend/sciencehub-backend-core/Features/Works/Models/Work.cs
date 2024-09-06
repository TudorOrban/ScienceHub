using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Serialization;

namespace sciencehub_backend_core.Features.Works.Models
{
    public class Work
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [Column("work_type")]
        public WorkType WorkType { get; set; }

        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Column("research_score")]
        public float? ResearchScore { get; set; }

        [Column("h_index")]
        public int? HIndex { get; set; }

        [Column("citations_count")]
        public int? CitationsCount { get; set; }

        [Column("link")]
        public string? Link { get; set; }

        [Column("public")]
        public bool? Public { get; set; }

        [Column("current_work_version_id")]
        public int? CurrentWorkVersionId { get; set; }

        private CustomJsonSerializer _serializer = new CustomJsonSerializer();

        [Column("work_metadata", TypeName = "jsonb")]
        public string? WorkMetadataJson { get; set; } = "{}";

        private WorkMetadataNew? _cachedWorkMetadata = null;

        [NotMapped]
        public WorkMetadataNew WorkMetadata
        {
            get => _cachedWorkMetadata ??= _serializer.DeserializeFromJson<WorkMetadataNew>(WorkMetadataJson ?? "{}");
            set
            {
                _cachedWorkMetadata = value;
                WorkMetadataJson = _serializer.SerializeToJson(value);
            }
        }

        [Column("file_location", TypeName = "jsonb")]
        public string? FileLocationJson { get; set; }

        private FileLocation? _cachedFileLocation = null;

        [NotMapped]
        public FileLocation FileLocation
        {
            get => _cachedFileLocation ??= _serializer.DeserializeFromJson<FileLocation>(FileLocationJson ?? "{}");
            set
            {
                _cachedFileLocation = value;
                FileLocationJson = _serializer.SerializeToJson(value);
            }
        }
        
        public ICollection<WorkUser> WorkUsers { get; set; } = new List<WorkUser>();
        public ICollection<ProjectWork> ProjectWorks { get; set; } = new List<ProjectWork>();
    }
}