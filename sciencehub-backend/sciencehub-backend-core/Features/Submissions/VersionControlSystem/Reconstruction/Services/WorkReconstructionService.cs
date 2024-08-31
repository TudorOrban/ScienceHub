using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Submissions.Models;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Reconstruction.Models;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Reconstruction.Services;
using sciencehub_backend_core.Features.Works.Models;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Services
{
    public class WorkReconstructionService : IWorkReconstructionService
    {
        private readonly AppDbContext _context;
        private readonly ISnapshotManager _snapshotManager;
        private readonly IDiffManager _diffManager;
        private readonly ISnapshotService _snapshotService;
        private readonly IGraphService _graphService;
        private readonly ILogger<WorkReconstructionService> _logger;

        public WorkReconstructionService(AppDbContext context, ISnapshotManager snapshotManager, IDiffManager diffManager, IGraphService graphService, ISnapshotService snapshotService, ILogger<WorkReconstructionService> logger)
        {
            _context = context;
            _snapshotManager = snapshotManager;
            _diffManager = diffManager;
            _graphService = graphService;
            _snapshotService = snapshotService;
            _logger = logger;
        }

        public async Task<WorkBase> FindWorkVersionData(int workId, string workType, int workVersionId)
        {
            // Parse work type
            var workTypeEnum = EnumParser.ParseWorkType(workType);
            if (!workTypeEnum.HasValue)
            {
                throw new InvalidWorkTypeException();
            }

            // Fetch work graph
            WorkGraph workGraph = await _graphService.FetchWorkGraph(workId, workTypeEnum.Value);

            // Find closest snapshot
            (string? version, Dictionary<string, string> path, int snapshotSize) = _snapshotManager.FindClosestSnapshot(workGraph.GraphData, workVersionId.ToString());

            // Fetch corresponding snapshot
            WorkSnapshot workSnapshot = await _snapshotService.FetchWorkSnapshot(workId, workTypeEnum.Value, Int32.Parse(version ?? "0"));

            // Fetch necessary deltas
            List<WorkSubmission> submissions = await GetWorkSubmissionsAsync(path);


            // Initiate work
            WorkBase workBase = new WorkBase
            {
                Id = workId,
                WorkType = workTypeEnum.Value,
                Title = workSnapshot?.SnapshotData.Title ?? "",
                Description = workSnapshot?.SnapshotData.Description ?? "",
                WorkMetadata = workSnapshot?.SnapshotData.WorkMetadata ?? new WorkMetadata(),
            };
            _logger.LogInformation($"WorkBase initiated: {JsonSerializer.Serialize(workBase)}, path: {JsonSerializer.Serialize(path)}, submissions: {JsonSerializer.Serialize(submissions)}");

            // Apply text diffs sequentially, starting from snapshot
            for (int i = submissions.Count - 1; i >= 0; i--)
            {
                _diffManager.ApplyTextDiffsToWork(workBase, submissions[i].WorkDelta);
            }

            // TODO: For text arrays, just find latest change and apply it
            for (int i = 0; i < submissions.Count; i++)
            {

            }
            _logger.LogInformation($"WorkBase after applying diffs: {JsonSerializer.Serialize(workBase)}");

            return workBase;
        }

        public async Task<List<WorkSubmission>> GetWorkSubmissionsAsync(Dictionary<string, string> path)
        {
            // Convert the dictionary into an array of version pairs
            var versionPairs = ConvertDictionaryToVersionPairs(path);

            _logger.LogInformation($"WorkBase after applying diffs: {JsonSerializer.Serialize(versionPairs)}");
            var submissions = await _context.WorkSubmissions
                .FromSqlRaw("SELECT * FROM new_fetch_work_submissions({0})", versionPairs)
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
                    // Flip the pairs before adding them to the list
                    pairs.Add(valueInt); 
                    pairs.Add(keyInt);
                }
            }
            return pairs.ToArray();
        }



    }
}