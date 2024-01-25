using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace sciencehub_backend.Features.Works.Models
{

    public class WorkBase
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
        public string? Link { get; set; }

        [Column("public")]
        public bool? Public { get; set; }

        [Column("current_work_version_id")]
        public int? CurrentWorkVersionId { get; set; }

        private CustomJsonSerializer _serializer = new CustomJsonSerializer();

        [Column("work_metadata", TypeName = "jsonb")]
        public string WorkMetadataJson { get; set; }

        private WorkMetadata _cachedWorkMetadata = null;

        [NotMapped]
        public WorkMetadata WorkMetadata
        {
            get => _cachedWorkMetadata ??= _serializer.DeserializeFromJson<WorkMetadata>(WorkMetadataJson);
            set
            {
                _cachedWorkMetadata = value;
                WorkMetadataJson = _serializer.SerializeToJson(value);
            }
        }

        [Column("file_location", TypeName = "jsonb")]
        public string? FileLocationJson { get; set; }

        private FileLocation _cachedFileLocation = null;

        [NotMapped]
        public FileLocation FileLocation
        {
            get => _cachedFileLocation ??= _serializer.DeserializeFromJson<FileLocation>(FileLocationJson);
            set
            {
                _cachedFileLocation = value;
                FileLocationJson = _serializer.SerializeToJson(value);
            }
        }

        public WorkBase()
        {
            if (!string.IsNullOrEmpty(WorkMetadataJson))
            {
                _cachedWorkMetadata = JsonSerializer.Deserialize<WorkMetadata>(WorkMetadataJson);
            }
            if (!string.IsNullOrEmpty(FileLocationJson))
            {
                _cachedFileLocation = JsonSerializer.Deserialize<FileLocation>(FileLocationJson);
            }
        }

        // protected WorkBase()
        // {
        //     _cachedWorkMetadata = null; // Initialize the field
        //     if (!string.IsNullOrEmpty(WorkMetadataJson))
        //     {
        //         _cachedWorkMetadata = JsonSerializer.Deserialize<WorkMetadata>(WorkMetadataJson);
        //     }
        // }
    }
}
