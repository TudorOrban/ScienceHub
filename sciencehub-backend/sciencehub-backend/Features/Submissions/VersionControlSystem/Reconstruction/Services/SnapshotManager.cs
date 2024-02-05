using System.Text.Json;
using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Features.Works.Models;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction
{
    public class SnapshotManager
    {

        private readonly ILogger<SnapshotManager> _logger;

        public SnapshotManager(ILogger<SnapshotManager> logger)
        {
            _logger = logger;
        }

        // Decide whether to take a snapshot
        public bool ShouldTakeSnapshot(GraphData graph, List<VersionEdge> edges, string newVersion, int newDeltaSize)
        {
            // Find closest snapshot, if none exists create one
            (string? version, Dictionary<string, string> path, int snapshotSize) = FindClosestSnapshot(graph, newVersion);
            _logger.LogInformation($"closest snapshot: {version}, path: {JsonSerializer.Serialize(path)}, snapshot size: {snapshotSize}");
            if (version == null)
            {
                return true;
            }

            // Compute total delta size
            int totalDeltaSize = ComputePathDeltaSize(path, edges) + newDeltaSize;
            // Take snapshot if it gets closer in size to previous snapshot
            // With more frequent snapshots as the previous snapshot's size grows larger
            int adjustedThreshold = (int)Math.Sqrt(snapshotSize);

            _logger.LogInformation($"path: {JsonSerializer.Serialize(path)}, Total delta size: {totalDeltaSize}, adjusted threshold: {adjustedThreshold}");
            return totalDeltaSize >= adjustedThreshold;
        }

        // BFS to find closest node marked snapshot
        public (string?, Dictionary<string, string>, int) FindClosestSnapshot(GraphData graph, string currentVersion)
        {
            Dictionary<string, bool> Visited = new Dictionary<string, bool>();
            Queue<string> Queue = new Queue<string>();
            Dictionary<string, string> Parent = new Dictionary<string, string>();
            Dictionary<string, string> Path = new Dictionary<string, string>();

            Queue.Enqueue(currentVersion);

            while (Queue.Count > 0)
            {
                string current = Queue.Dequeue();
                if (current == null || Visited.ContainsKey(current) && Visited[current])
                {
                    continue;
                }
                Visited[current] = true;

                if (graph[current].IsSnapshot)
                {
                    string temp = current;
                    while (temp != null && Parent.ContainsKey(temp))
                    {
                        Path[Parent[temp]] = temp;
                        temp = Parent[temp];
                    }
                    return (current, Path, graph[current].SnapshotSize ?? 0);
                }

                var neighbors = graph[current].Neighbors ?? new List<string>();
                foreach (var neighbor in neighbors)
                {
                    if (!Visited.ContainsKey(neighbor))
                    {
                        Queue.Enqueue(neighbor);
                        Parent[neighbor] = current;
                    }
                }
            }

            return (null, new Dictionary<string, string>(), 0);
        }


        // Sum up delta sizes along the path
        private int ComputePathDeltaSize(Dictionary<string, string> path, List<VersionEdge> edges)
        {
            int totalDeltaSize = 0;
            foreach (var item in path)
            {
                string fromVersion = item.Value;
                string toVersion = item.Key;
                var edge = edges.FirstOrDefault(e => (e.FromVersion == fromVersion && e.ToVersion == toVersion) ||
                                                     (e.FromVersion == toVersion && e.ToVersion == fromVersion));
                if (edge != null)
                {
                    totalDeltaSize += edge.DeltaSize;
                }
            }
            return totalDeltaSize;
        }

        public int ComputeWorkSnapshotSize(WorkBase work)
        {
            if (work == null) throw new ArgumentNullException(nameof(work));

            int size = 0;

            // Directly access the properties of work
            if (work.Title != null)
            {
                size += work.Title.Length;
            }
            if (work.Description != null)
            {
                size += work.Description.Length;
            }
            // if (work.Abstract != null)
            // {
            //     size += work.Abstract.Length;
            // }
            // if (work.Introduction != null)
            // {
            //     size += work.Introduction.Length;
            // }
            // if (work.Objective != null)
            // {
            //     size += work.Objective.Length;
            // }

            // Assuming WorkMetadata is a property of WorkBase and has these fields
            if (work.WorkMetadata == null) throw new ArgumentNullException(nameof(work.WorkMetadata));

            if (work.WorkMetadata.License != null)
            {
                size += work.WorkMetadata.License.Length;
            }
            if (work.WorkMetadata.Publisher != null)
            {
                size += work.WorkMetadata.Publisher.Length;
            }
            if (work.WorkMetadata.Conference != null)
            {
                size += work.WorkMetadata.Conference.Length;
            }

            return size;
        }


        public int ComputeProjectSnapshotSize(Project project)
        {
            if (project == null) throw new ArgumentNullException(nameof(project));

            int size = 0;

            // Directly access the properties of project
            if (project.Title != null)
            {
                size += project.Title.Length;
            }
            if (project.Description != null)
            {
                size += project.Description.Length;
            }
            // if (project.Abstract != null)
            // {
            //     size += project.Abstract.Length;
            // }
            // if (project.Introduction != null)
            // {
            //     size += project.Introduction.Length;
            // }
            // if (project.Objective != null)
            // {
            //     size += project.Objective.Length;
            // }

            // Assuming ProjectMetadata is a property of ProjectBase and has these fields
            if (project.ProjectMetadata == null) throw new ArgumentNullException(nameof(project.ProjectMetadata));

            if (project.ProjectMetadata.License != null)
            {
                size += project.ProjectMetadata.License.Length;
            }
            if (project.ProjectMetadata.Publisher != null)
            {
                size += project.ProjectMetadata.Publisher.Length;
            }
            if (project.ProjectMetadata.Conference != null)
            {
                size += project.ProjectMetadata.Conference.Length;
            }

            return size;
        }
    }
}