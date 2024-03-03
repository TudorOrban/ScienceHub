using sciencehub_backend.Core.Users.Models;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Services
{
    public interface IProjectSubmissionAcceptService
    {
        Task<List<WorkUserDto>> AcceptProjectSubmissionAsync(int projectSubmissionId, string currentUserIdString);
    }
}