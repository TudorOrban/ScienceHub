using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Features.Works.Models;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Services
{
    public interface ISnapshotManager
    {
        bool ShouldTakeSnapshot(GraphData graph, List<VersionEdge> edges, string newVersion, int newDeltaSize);
        (string?, Dictionary<string, string>, int) FindClosestSnapshot(GraphData graph, string currentVersion);
        int ComputeWorkSnapshotSize(WorkBase work);
        int ComputeProjectSnapshotSize(Project project);
    }
}