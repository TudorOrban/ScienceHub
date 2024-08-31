namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models
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
        public int? SnapshotSize { get; set; }
    }

    public class VersionEdge
    {
        public string FromVersion { get; set; }
        public string ToVersion { get; set; }
        public int DeltaSize { get; set; }
    }

    public class VersionEdges : List<VersionEdge> {}
}