using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Data;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Services;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Shared.Enums;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Services
{
    public class WorkReconstructionService
    {
        AppDbContext _context;
        SnapshotManager _snapshotManager;
        DiffManager _diffManager;
        SnapshotService _snapshotService;
        GraphService _graphService;

        public WorkReconstructionService(AppDbContext context, SnapshotManager snapshotManager, DiffManager diffManager, GraphService graphService, SnapshotService snapshotService)
        {
            _context = context;
            _snapshotManager = snapshotManager;
            _diffManager = diffManager;
            _graphService = graphService;
            _snapshotService = snapshotService;
        }

        public async Task<WorkBase> FindWorkVersionData(int workId, WorkType workType, int workVersionId)
        {
            // Fetch work graph
            WorkGraph workGraph = await _graphService.fetchWorkGraph(workId, workType);

            // Find closest snapshot
            (string? version, Dictionary<string, string> path, int snapshotSize) = _snapshotManager.FindClosestSnapshot(workGraph.GraphData, workVersionId.ToString());

            // Fetch corresponding snapshot
            WorkSnapshot? workSnapshot = await _snapshotService.FetchWorkSnapshot(workId, workType.ToString(), Int32.Parse(version ?? "0"));

            // Fetch necessary deltas
            List<WorkSubmission> submissions = await GetWorkSubmissionsAsync(path);

            // Initiate work
            WorkBase workBase = new WorkBase
            {
                Id = workId,
                WorkType = workType.ToString(),
                Title = workSnapshot?.SnapshotData.Title ?? "",
                Description = workSnapshot?.SnapshotData.Description ?? "",
                WorkMetadata = workSnapshot?.SnapshotData.WorkMetadata ?? new WorkMetadata(),
            };

            // Apply text diffs sequentially, starting from snapshot
            for (int i = submissions.Count - 1; i > submissions.Count; i--)
            {
                _diffManager.ApplyTextDiffsToWork(workBase, submissions[i].WorkDelta);
            }

            // TODO: For text arrays, just find latest change and apply it
            for (int i = 0; i < submissions.Count; i++)
            {

            }

            return workBase;
        }

        public async Task<List<WorkSubmission>> GetWorkSubmissionsAsync(Dictionary<string, string> path)
        {
            // Convert the dictionary into an array of version pairs
            var versionPairs = ConvertDictionaryToVersionPairs(path);

            // Convert the array into a string representation understood by PostgreSQL
            var versionPairsParam = "{" + string.Join(",", versionPairs) + "}";

            var submissions = await _context.WorkSubmissions
                .FromSqlRaw("SELECT * FROM fetch_work_submissions({0})", versionPairsParam)
                .ToListAsync();

            return submissions;
        }

        public int[] ConvertDictionaryToVersionPairs(Dictionary<string, string> path)
        {
            var pairs = new List<int>();
            foreach (var kvp in path)
            {
                if (int.TryParse(kvp.Key, out int keyInt) && int.TryParse(kvp.Value, out int valueInt))
                {
                    pairs.Add(keyInt);
                    pairs.Add(valueInt);
                }
            }
            return pairs.ToArray();
        }


    }
}