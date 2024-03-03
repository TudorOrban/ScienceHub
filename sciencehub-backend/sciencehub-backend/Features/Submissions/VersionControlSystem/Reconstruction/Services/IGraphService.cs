using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Shared.Enums;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Services
{
    public interface IGraphService
    {
        Task<WorkGraph> FetchWorkGraph(int workId, WorkType workType);
        Task<ProjectGraph> FetchProjectGraph(int projectId);
        Task UpdateProjectGraphAsync(int projectId, int initialProjectVersionId, int finalProjectVersionId);
        Task UpdateWorkGraphAsync(int workId, WorkType workType, int initialWorkVersionId, int finalWorkVersionId);
    }
}