using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Data;
using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Services;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Serialization;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Services
{
    public class SnapshotService : ISnapshotService
    {

        private readonly AppDbContext _context;
        private readonly ISnapshotManager _snapshotManager;
        private readonly ITextDiffManager _textDiffManager;
        private readonly IGraphService _graphService;
        private readonly CustomJsonSerializer _serializer;
        private readonly ILogger<SnapshotService> _logger;

        public SnapshotService(AppDbContext appDbContext, ISnapshotManager snapshotManager, IGraphService graphService, ITextDiffManager textDiffManager, ILogger<SnapshotService> logger, CustomJsonSerializer serializer)
        {
            _context = appDbContext;
            _snapshotManager = snapshotManager;
            _graphService = graphService;
            _textDiffManager = textDiffManager;
            _serializer = serializer;
            _logger = logger;
        }

        public async Task ProcessWorkSnapshot(WorkBase work, WorkSubmission workSubmission)
        {   
            // Fetch work graph
            WorkGraph workGraph = await _graphService.FetchWorkGraph(work.Id, workSubmission.WorkType);

            // Compute new delta's size
            int deltaSize = _textDiffManager.CalculateWorkDeltaSize(workSubmission.WorkDelta);

            // Access to trigger lazy loading
            workGraph.GraphData = workGraph.GraphData;
            workGraph.VersionEdges = workGraph.VersionEdges;

            // Add new edge for the new submission
            var newVersionEdge = new VersionEdge
            {
                FromVersion = workSubmission.InitialWorkVersionId.ToString(),
                ToVersion = workSubmission.FinalWorkVersionId.ToString(),
                DeltaSize = deltaSize
            };
            workGraph.VersionEdges.Add(newVersionEdge);
            workGraph.VersionEdgesJson = _serializer.SerializeToJson(workGraph.VersionEdges);
            _context.WorkGraphs.Update(workGraph);

            // Decide if a snapshot should be taken
            bool takeSnapshot = _snapshotManager.ShouldTakeSnapshot(workGraph.GraphData, workGraph.VersionEdges, workSubmission.FinalWorkVersionId.ToString(), deltaSize);

            // Take snapshot if needed
            if (takeSnapshot)
            {
                await TakeWorkSnapshot(work, workSubmission.InitialWorkVersionId, work.WorkType);

                // Compute snapshot size
                int snapshotSize = _snapshotManager.ComputeWorkSnapshotSize(work);

                _logger.LogInformation($"Took snapshot for work {work.Id} with version {workSubmission.InitialWorkVersionId}, size: {snapshotSize}");
                // Update graph with isSnapshot marker and size
                workGraph.GraphData[workSubmission.InitialWorkVersionId.ToString()].IsSnapshot = true;
                workGraph.GraphData[workSubmission.InitialWorkVersionId.ToString()].SnapshotSize = snapshotSize;
                workGraph.GraphDataJson = _serializer.SerializeToJson(workGraph.GraphData);
                await _context.SaveChangesAsync();
            }

            // Save changes to the work graph
            await _context.SaveChangesAsync();
        }

        public async Task ProcessProjectSnapshot(Project project, ProjectSubmission projectSubmission)
        {
            // Fetch project graph
            ProjectGraph projectGraph = await _graphService.FetchProjectGraph(project.Id);

            // Compute new delta's size
            int deltaSize = _textDiffManager.CalculateProjectDeltaSize(projectSubmission.ProjectDelta);

            // Access to trigger lazy loading
            projectGraph.GraphData = projectGraph.GraphData;
            projectGraph.VersionEdges = projectGraph.VersionEdges;

            // Add new edge for the new submission
            var newVersionEdge = new VersionEdge
            {
                FromVersion = projectSubmission.InitialProjectVersionId.ToString(),
                ToVersion = projectSubmission.FinalProjectVersionId.ToString(),
                DeltaSize = deltaSize
            };
            projectGraph.VersionEdges.Add(newVersionEdge);
            projectGraph.VersionEdgesJson = _serializer.SerializeToJson(projectGraph.VersionEdges);
            _context.ProjectGraphs.Update(projectGraph);

            // Decide if a snapshot should be taken
            bool takeSnapshot = _snapshotManager.ShouldTakeSnapshot(projectGraph.GraphData, projectGraph.VersionEdges, projectSubmission.FinalProjectVersionId.ToString(), deltaSize);

            // Take snapshot if needed
            if (takeSnapshot)
            {
                await TakeProjectSnapshot(project, projectSubmission.InitialProjectVersionId);

                // Compute snapshot size
                int snapshotSize = _snapshotManager.ComputeProjectSnapshotSize(project);

                _logger.LogInformation($"Took snapshot for project {project.Id} with version {projectSubmission.InitialProjectVersionId}, size: {snapshotSize}");
                // Update graph with isSnapshot marker and size
                projectGraph.GraphData[projectSubmission.InitialProjectVersionId.ToString()].IsSnapshot = true;
                projectGraph.GraphData[projectSubmission.InitialProjectVersionId.ToString()].SnapshotSize = snapshotSize;
                projectGraph.GraphDataJson = _serializer.SerializeToJson(projectGraph.GraphData);
                await _context.SaveChangesAsync();
            }

            // Save changes to the work graph
            await _context.SaveChangesAsync();
        }

        public async Task TakeWorkSnapshot(WorkBase work, int versionId, WorkType workType)
        {
            WorkSnapshot workSnapshot = new WorkSnapshot
            {
                WorkId = work.Id,
                WorkType = workType,
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

        public async Task TakeProjectSnapshot(Project project, int versionId)
        {
            ProjectSnapshot projectSnapshot = new ProjectSnapshot
            {
                ProjectId = project.Id,
                SnapshotData = new SnapshotData
                {
                    Title = project.Title,
                    Description = project.Description,
                    // Abstract = project.Abstract,
                    // Introduction = project.Introduction,
                    // Objective = project.Objective,
                    ProjectMetadata = project.ProjectMetadata
                },
                ProjectVersionId = versionId,
            };

            _context.ProjectSnapshots.Add(projectSnapshot);
            await _context.SaveChangesAsync();
        }

        public async Task<WorkSnapshot> FetchWorkSnapshot(int workId, WorkType workType, int versionId)
        {
            _logger.LogInformation($"Fetching work snapshot for workId: {workId} and workType: {workType}, version id: {versionId}");
            WorkSnapshot? workSnapshot = await _context.WorkSnapshots.FirstOrDefaultAsync(w => w.WorkId == workId && w.WorkType == workType && w.WorkVersionId == versionId);
            if (workSnapshot == null)
            {
                throw new Exception("Work snapshot not found");
            }

            return workSnapshot;
        }
    }
}