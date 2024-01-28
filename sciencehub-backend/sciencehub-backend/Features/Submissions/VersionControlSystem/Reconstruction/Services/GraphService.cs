using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Data;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Shared.Enums;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Services
{
    public class GraphService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<GraphService> _logger;

        public GraphService(AppDbContext context, ILogger<GraphService> logger)
        {
            _context = context;
            _logger = logger;
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
    }
}