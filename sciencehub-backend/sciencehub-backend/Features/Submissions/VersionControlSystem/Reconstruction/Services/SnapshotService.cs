using sciencehub_backend.Data;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Models;
using sciencehub_backend.Features.Works.Models;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Services
{
    public class SnapshotService
    {

        private readonly AppDbContext _context;
        private readonly WorkSnapshotManager _workSnapshotManager;
        private readonly TextDiffManager _textDiffManager;
        private readonly WorkGraphService _workGraphService;

        public SnapshotService(AppDbContext appDbContext, WorkSnapshotManager workSnapshotManager, WorkGraphService workGraphService, TextDiffManager textDiffManager)
        {
            _context = appDbContext;
            _workSnapshotManager = workSnapshotManager;
            _workGraphService = workGraphService;
            _textDiffManager = textDiffManager;
        }

        public async Task ProcessSnapshot(WorkBase work, WorkSubmission workSubmission)
        {
            // Fetch work graph
            WorkGraph workGraph = await _workGraphService.fetchWorkGraph(work.Id, work.WorkType);

            // Compute new delta's size
            int deltaSize = _textDiffManager.CalculateDeltaSize(workSubmission.WorkDelta);

            // Add new edge for the new submission
            var newVersionEdge = new VersionEdge
            {
                FromVersion = workSubmission.InitialWorkVersionId.ToString(),
                ToVersion = workSubmission.FinalWorkVersionId.ToString(),
                DeltaSize = deltaSize
            };
            workGraph.VersionEdges.Add(newVersionEdge);
            _context.WorkGraphs.Update(workGraph);
            
            // Decide if a snapshot should be taken
            bool takeSnapshot = _workSnapshotManager.ShouldTakeSnapshot(workGraph.GraphData, workGraph.VersionEdges, workSubmission.FinalWorkVersionId.ToString(), deltaSize);

            // Take snapshot if needed
            if (takeSnapshot)
            {
                await TakeSnapshot(work, workSubmission.InitialWorkVersionId);

                // Update graph with isSnapshot marker and size
                workGraph.GraphData[workSubmission.InitialWorkVersionId.ToString()].IsSnapshot = true;
                workGraph.GraphData[workSubmission.InitialWorkVersionId.ToString()].SnapshotSize = _workSnapshotManager.ComputeSnapshotSize(work);
            }
            
            // Save changes to the work graph
            await _context.SaveChangesAsync();
        }

        public async Task TakeSnapshot(WorkBase work, int versionId)
        {
            WorkSnapshot workSnapshot = new WorkSnapshot
            {
                WorkId = work.Id,
                WorkType = work.WorkType,
                SnapshotData = new SnapshotData
                {
                    Title = work.Title,
                    Description = work.Description,
                    // Abstract = work.Abstract,
                    // Introduction = work.Introduction,
                    // Objective = work.Objective,
                    WorkMetadata = work.WorkMetadata
                },
                WorkVersionId = versionId,
            };
            
            _context.WorkSnapshots.Add(workSnapshot);
            await _context.SaveChangesAsync();
        }
    }
}