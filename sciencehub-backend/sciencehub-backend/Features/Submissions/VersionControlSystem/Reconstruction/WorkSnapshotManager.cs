using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Features.Works.Models;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction
{
    public class WorkSnapshotManager
    {

        // Decide whether to take a snapshot
        public bool ShouldTakeSnapshot(GraphData graph, List<VersionEdge> edges, string newVersion, int newDeltaSize)
        {
            // Find closest snapshot, if none exists create one
            (string? version, Dictionary<string, string> closestSnapshot, int snapshotSize) = FindClosestSnapshot(graph, newVersion);

            if (closestSnapshot.Count == 0 || version == null)
            {
                return true;
            }

            // Compute total delta size
            int totalDeltaSize = ComputePathDeltaSize(closestSnapshot, edges) + newDeltaSize;

            // Take snapshot if it gets closer in size to previous snapshot
            // With more frequent snapshots as the previous snapshot's size grows larger
            int adjustedThreshold = (int)Math.Sqrt(snapshotSize);

            return totalDeltaSize >= adjustedThreshold;
        }

        // BDS to find closest node marked snapshot
        public (string?, Dictionary<string, string>, int) FindClosestSnapshot(GraphData graph, string currentVersion)
        {
            Dictionary<string, bool> Visited = new Dictionary<string, bool>();
            Queue<string> Queue = [];
            Dictionary<string, string> Parent = new Dictionary<string, string>();
            Dictionary<string, string> Path = new Dictionary<string, string>();

            Queue.Append(currentVersion);

            while (Queue.Count > 0)
            {
                string current = Queue.Dequeue();
                if (current == null || Visited[current])
                {
                    continue;
                }
                Visited[current] = true;

                if (graph[current].IsSnapshot)
                {
                    string temp = current;
                    while (Parent[temp] != null)
                    {
                        Path[temp] = current;
                        temp = Parent[temp];
                    }
                    return (Path[current], Path, graph[current].SnapshotSize ?? 0);
                }

                var neighbors = graph[current].Neighbors ?? new List<string>();
                foreach (var neighbor in neighbors)
                {
                    if (!Visited[neighbor])
                    {
                        Queue.Enqueue(neighbor);
                        if (Parent[neighbor] == null)
                        {
                            Parent[neighbor] = current;
                        }
                    }
                }

            };

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

        public int ComputeSnapshotSize(WorkBase work)
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


    }
}