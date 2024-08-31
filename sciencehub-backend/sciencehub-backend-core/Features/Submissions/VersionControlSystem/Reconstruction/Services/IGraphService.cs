using sciencehub_backend_core.Features.Projects.Models;
using sciencehub_backend_core.Features.Works.Models;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Reconstruction.Services
{
    public interface IGraphService
    {
        Task<WorkGraph> FetchWorkGraph(int workId, WorkType workType);
        Task<ProjectGraph> FetchProjectGraph(int projectId);
        Task UpdateProjectGraphAsync(int projectId, int initialProjectVersionId, int finalProjectVersionId);
        Task UpdateWorkGraphAsync(int workId, WorkType workType, int initialWorkVersionId, int finalWorkVersionId);
    }
}