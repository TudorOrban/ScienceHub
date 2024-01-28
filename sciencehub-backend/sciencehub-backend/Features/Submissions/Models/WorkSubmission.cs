using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace sciencehub_backend.Features.Submissions.Models
{
    [Table("work_submissions")]
    public class WorkSubmission
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("work_id")]
        public int WorkId { get; set; }

        [Column("work_type")]
        public WorkType WorkType { get; set; }

        [Column("initial_work_version_id")]
        public int InitialWorkVersionId { get; set; }

        [Column("final_work_version_id")]
        public int FinalWorkVersionId { get; set; }

        [Column("status")]
        public SubmissionStatus Status { get; set; }

        [Column("title")]
        public string Title { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("public")]
        public bool? Public { get; set; }

        private CustomJsonSerializer _serializer = new CustomJsonSerializer();

        // Custom (de)serialization and caching of jsonb columns
        [Column("work_delta", TypeName = "jsonb")]
        public string? WorkDeltaJson { get; set; }

        private WorkDelta _cachedWorkDelta = null;

        [NotMapped]
        public WorkDelta WorkDelta
        {
            get => _cachedWorkDelta ??= _serializer.DeserializeFromJson<WorkDelta>(WorkDeltaJson);
            set
            {
                _cachedWorkDelta = value;
                WorkDeltaJson = _serializer.SerializeToJson(value);
            }
        }


        [Column("file_changes", TypeName = "jsonb")]
        public string? FileChangesJson { get; set; }

        private FileChanges _cachedFileChanges = null;

        [NotMapped]
        public FileChanges FileChanges
        {
            get => _cachedFileChanges ??= _serializer.DeserializeFromJson<FileChanges>(FileChangesJson);
            set
            {
                _cachedFileChanges = value;
                FileChangesJson = _serializer.SerializeToJson(value);
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

        public ICollection<ProjectWorkSubmission>? ProjectWorkSubmissions { get; set; }
        public ICollection<WorkSubmissionUser>? WorkSubmissionUsers { get; set; }
    }
}