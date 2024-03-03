using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Serialization;
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
        public string? Description { get; set; }

        [Column("public")]
        public bool Public { get; set; }

        private CustomJsonSerializer _serializer = new CustomJsonSerializer();

        // Custom (de)serialization and caching of jsonb columns
        [Column("project_delta", TypeName = "jsonb")]
        public string? ProjectDeltaJson { get; set; }

        private ProjectDelta _cachedProjectDelta = null;

        [NotMapped]
        public ProjectDelta ProjectDelta
        {
            get => _cachedProjectDelta ??= _serializer.DeserializeFromJson<ProjectDelta>(ProjectDeltaJson);
            set
            {
                _cachedProjectDelta = value;
                ProjectDeltaJson = _serializer.SerializeToJson(value);
            }
        }

        [Column("submitted_data", TypeName = "jsonb")]
        public string? SubmittedDataJson { get; set; }

        private SubmittedData _cachedSubmittedData = null;

        [NotMapped]
        public SubmittedData SubmittedData
        {
            get => _cachedSubmittedData ??= _serializer.DeserializeFromJson<SubmittedData>(SubmittedDataJson);
            set
            {
                _cachedSubmittedData = value;
                SubmittedDataJson = _serializer.SerializeToJson(value);
            }
        }

        [Column("accepted_data", TypeName = "jsonb")]
        public string? AcceptedDataJson { get; set; }

        private AcceptedData _cachedAcceptedData = null;

        [NotMapped]
        public AcceptedData AcceptedData
        {
            get => _cachedAcceptedData ??= _serializer.DeserializeFromJson<AcceptedData>(AcceptedDataJson);
            set
            {
                _cachedAcceptedData = value;
                AcceptedDataJson = _serializer.SerializeToJson(value);
            }
        }

        public ICollection<ProjectWorkSubmission> ProjectWorkSubmissions { get; set; }
        public ICollection<ProjectSubmissionUser> ProjectSubmissionUsers { get; set; }
    }
}
