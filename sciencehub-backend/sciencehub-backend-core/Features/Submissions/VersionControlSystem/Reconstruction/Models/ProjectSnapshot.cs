using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Shared.Serialization;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Reconstruction.Models
{
    [Table("project_snapshots")]
    public class ProjectSnapshot
    {

        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("project_id")]
        public int ProjectId { get; set; }

        [Column("project_version_id")]
        public int ProjectVersionId { get; set; }

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