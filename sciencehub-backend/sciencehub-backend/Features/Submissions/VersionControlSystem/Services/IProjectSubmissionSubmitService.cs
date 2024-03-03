using Microsoft.EntityFrameworkCore.Storage;
using sciencehub_backend.Features.Submissions.Models;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Services
{
    public interface IProjectSubmissionSubmitService
    {
        Task<ProjectSubmission> SubmitProjectSubmissionAsync(int projectSubmissionId, string currentUserIdString);
    }
}