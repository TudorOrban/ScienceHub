using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Features.Submissions.Models;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Services
{
    public interface IProjectSubmissionAcceptService
    {
        Task<ProjectSubmission> AcceptProjectSubmissionAsync(int projectSubmissionId, string currentUserIdString);
    }
}