using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Features.Projects.Models;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend_core.Features.Works.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Serialization;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Reconstruction.Services
{
    public class GraphService : IGraphService
    {
        private readonly CoreServiceDbContext _context;
        private readonly ILogger<GraphService> _logger;
        private readonly CustomJsonSerializer _serializer;

        public GraphService(CoreServiceDbContext context, ILogger<GraphService> logger, CustomJsonSerializer serializer)
        {
            _context = context;
            _logger = logger;
            _serializer = serializer;
        }

        public async Task<WorkGraph> FetchWorkGraph(int workId, WorkType workType)
        {
            _logger.LogInformation($"Fetching work graph for workId: {workId} and workType: {workType}");
            WorkGraph? workGraph = await _context.WorkGraphs.FirstOrDefaultAsync(w => w.WorkId == workId && w.WorkType == workType);
            if (workGraph == null)
            {
                throw new Exception("Work graph not found");
            }

            return workGraph;
        }

        public async Task<ProjectGraph> FetchProjectGraph(int projectId)
        {
            ProjectGraph? projectGraph = await _context.ProjectGraphs.FirstOrDefaultAsync(w => w.ProjectId == projectId);
            if (projectGraph == null)
            {
                throw new Exception("Project graph not found");
            }

            return projectGraph;
        }

        public async Task UpdateProjectGraphAsync(int projectId, int initialProjectVersionId, int finalProjectVersionId)
        {
            // Retrieve the existing project graph
            var projectGraph = await _context.ProjectGraphs
                .FirstOrDefaultAsync(pg => pg.ProjectId == projectId);

            if (projectGraph == null)
            {
                // Handle the case where the project graph doesn't exist yet
                // TODO: Handle more gracefully in the future
                projectGraph = new ProjectGraph
                {
                    ProjectId = projectId,
                    GraphData = new GraphData()
                };
                _context.ProjectGraphs.Add(projectGraph);
            }

            // Update the project graph:
            // Add node = final version id, and edge between current submission's initial and final version ids
            var initialVersionIdStr = initialProjectVersionId.ToString();
            var finalVersionIdStr = finalProjectVersionId.ToString();

            if (!projectGraph.GraphData.ContainsKey(initialVersionIdStr))
            {
                projectGraph.GraphData[initialVersionIdStr] = new GraphNode
                {
                    Neighbors = new List<string>(),
                    IsSnapshot = false
                };
            }
            projectGraph.GraphData[initialVersionIdStr].Neighbors.Add(finalVersionIdStr);

            if (!projectGraph.GraphData.ContainsKey(finalVersionIdStr))
            {
                projectGraph.GraphData[finalVersionIdStr] = new GraphNode
                {
                    Neighbors = new List<string>(),
                    IsSnapshot = false
                };
            }
            projectGraph.GraphData[finalVersionIdStr].Neighbors.Add(initialVersionIdStr);

            // Force update the serialized JSON
            projectGraph.GraphDataJson = _serializer.SerializeToJson(projectGraph.GraphData);

            await _context.SaveChangesAsync();

        }

        public async Task UpdateWorkGraphAsync(int workId, WorkType workType, int initialWorkVersionId, int finalWorkVersionId)
        {
            // Retrieve the existing work graph
            var workGraph = await _context.WorkGraphs
                .FirstOrDefaultAsync(wg => wg.WorkId == workId && wg.WorkType == workType);

            if (workGraph == null)
            {
                // Handle the case where the work graph doesn't exist yet
                // TODO: Handle more gracefully in the future
                workGraph = new WorkGraph
                {
                    WorkId = workId,
                    WorkType = workType,
                    GraphData = new GraphData()
                };
                _context.WorkGraphs.Add(workGraph);
            }

            // Update the work graph:
            // Add node = final version id, and edge between current submission's initial and final version ids
            var initialVersionIdStr = initialWorkVersionId.ToString();
            var finalVersionIdStr = finalWorkVersionId.ToString();

            // Add or update the initial version node
            if (!workGraph.GraphData.ContainsKey(initialVersionIdStr))
            {
                workGraph.GraphData[initialVersionIdStr] = new GraphNode();
            }
            workGraph.GraphData[initialVersionIdStr].Neighbors.Add(finalVersionIdStr);

            // Add or update the final version node
            if (!workGraph.GraphData.ContainsKey(finalVersionIdStr))
            {
                workGraph.GraphData[finalVersionIdStr] = new GraphNode();
            }
            workGraph.GraphData[finalVersionIdStr].Neighbors.Add(initialVersionIdStr);

            workGraph.GraphDataJson = _serializer.SerializeToJson(workGraph.GraphData);

            _context.WorkGraphs.Update(workGraph);
            
            await _context.SaveChangesAsync();
        }
    }
}