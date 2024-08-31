using sciencehub_backend_core.Core.Users.Models;
using sciencehub_backend_core.Features.Submissions.Models;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Services
{
    public interface IProjectSubmissionAcceptService
    {
        Task<ProjectSubmission> AcceptProjectSubmissionAsync(int projectSubmissionId, string currentUserIdString);
    }
}