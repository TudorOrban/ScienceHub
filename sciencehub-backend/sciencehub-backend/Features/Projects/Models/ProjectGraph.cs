using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Features.Projects.Models
{
    [Table("project_versions_graphs")]
    public class ProjectGraph
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("project_id")]
        public int ProjectId { get; set; }

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

