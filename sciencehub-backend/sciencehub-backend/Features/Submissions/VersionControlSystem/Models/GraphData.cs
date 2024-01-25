namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Models
{

    public class GraphData : Dictionary<string, GraphNode>
    {
    }

    public class GraphNode
    {
        public GraphNode()
        {
            Neighbors = new List<string>();
        }

        public List<string> Neighbors { get; set; }
        public bool IsSnapshot { get; set; }
    }
}