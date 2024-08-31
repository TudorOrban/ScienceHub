using Microsoft.EntityFrameworkCore.Storage;
using sciencehub_backend_core.Features.Submissions.Models;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Services
{
    public interface IWorkSubmissionSubmitService
    {
        Task<WorkSubmission> SubmitWorkSubmissionAsync(int workSubmissionId, string currentUserIdString, bool? bypassPermissions = false, IDbContextTransaction? transaction = null);
    }
}