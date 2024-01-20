using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using sciencehub_backend.Shared.Enums;

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

        [Column("graph_data", TypeName = "jsonb")]
        public string GraphData { get; set; }

        [NotMapped]
        public Dictionary<string, GraphNode> GraphDataParsed
        {
            get => string.IsNullOrEmpty(GraphData)
                ? new Dictionary<string, GraphNode>()
                : JsonConvert.DeserializeObject<Dictionary<string, GraphNode>>(GraphData);
            set => GraphData = JsonConvert.SerializeObject(value);
        }
    }

    public class GraphNode
    {
        public List<string> Neighbors { get; set; }
        public bool IsSnapshot { get; set; }
    }
}
