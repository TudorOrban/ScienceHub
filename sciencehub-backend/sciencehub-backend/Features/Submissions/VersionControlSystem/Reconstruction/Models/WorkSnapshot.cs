using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend.Shared.Serialization;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Models
{
    [Table("work_snapshots")]
    public class WorkSnapshot
    {

        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("work_id")]
        public int WorkId { get; set; }

        [Column("work_type")]
        public string WorkType { get; set; }

        [Column("work_version_id")]
        public int WorkVersionId { get; set; }

        private CustomJsonSerializer _serializer = new CustomJsonSerializer();

        // Custom (de)serialization and caching of jsonb columns
        [Column("snapshot_data", TypeName = "jsonb")]
        public string SnapshotDataJson { get; set; }

        private SnapshotData _cachedSnapshotData = null;

        [NotMapped]
        public SnapshotData SnapshotData
        {
            get => _cachedSnapshotData ??= _serializer.DeserializeFromJson<SnapshotData>(SnapshotDataJson);
            set
            {
                _cachedSnapshotData = value;
                SnapshotDataJson = _serializer.SerializeToJson(value);
            }
        }
    }
}