using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend_core.Features.Works.Models;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Services
{
    public interface IDiffManager
    {
        void ApplyTextDiffsToWork(Work work, WorkDelta delta);
        void ApplyTextArraysToWork(Work work, WorkDelta delta);

    }
}