using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Serialization;

namespace sciencehub_backend.Features.Works.Models
{
    [Table("work_versions_graphs")]
    public class WorkGraph
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("work_id")]
        public int WorkId { get; set; }

        [Column("work_type")]
        public WorkType WorkType { get; set; }
        private CustomJsonSerializer _serializer = new CustomJsonSerializer();

        [Column("graph_data", TypeName = "jsonb")]
        public string GraphDataJson { get; set; }

        private GraphData _cachedGraphData = null;

        [NotMapped]
        public GraphData GraphData
        {
            get => _cachedGraphData ??= _serializer.DeserializeFromJson<GraphData>(GraphDataJson);
            set
            {
                _cachedGraphData = value;
                GraphDataJson = _serializer.SerializeToJson(value);
            }
        }
    }

}
