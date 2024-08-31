using Microsoft.EntityFrameworkCore.Storage;
using sciencehub_backend_core.Features.Submissions.Models;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Services
{
    public interface IWorkSubmissionAcceptService
    {
        Task<WorkSubmission> AcceptWorkSubmissionAsync(int workSubmissionId, string currentUserIdString, bool? bypassPermissions = false, IDbContextTransaction? transaction = null);
    }
}