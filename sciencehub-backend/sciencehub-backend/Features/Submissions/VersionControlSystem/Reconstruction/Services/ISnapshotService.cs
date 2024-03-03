using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Models;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Shared.Enums;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Services
{
    public interface ISnapshotService
    {
        Task ProcessWorkSnapshot(WorkBase work, WorkSubmission workSubmission);
        Task ProcessProjectSnapshot(Project project, ProjectSubmission projectSubmission);
        Task TakeWorkSnapshot(WorkBase work, int versionId, WorkType workType);
        Task TakeProjectSnapshot(Project project, int versionId);
        Task<WorkSnapshot> FetchWorkSnapshot(int workId, WorkType workType, int versionId);
    }
}