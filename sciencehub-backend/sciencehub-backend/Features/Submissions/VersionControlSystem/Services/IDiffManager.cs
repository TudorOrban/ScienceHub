using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Features.Works.Models;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Services
{
    public interface IDiffManager
    {
        void ApplyTextDiffsToWork(WorkBase work, WorkDelta delta);
        void ApplyTextArraysToWork(WorkBase work, WorkDelta delta);
        void ApplyDiffsToSpecificProperties(WorkBase work, WorkDelta delta);

    }
}