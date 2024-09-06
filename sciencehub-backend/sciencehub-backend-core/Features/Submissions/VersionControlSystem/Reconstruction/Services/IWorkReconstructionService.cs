using sciencehub_backend_core.Features.Submissions.Models;
using sciencehub_backend_core.Features.NewWorks.Models;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Reconstruction.Services
{
    public interface IWorkReconstructionService
    {
        Task<Work> FindWorkVersionData(int workId, string workType, int workVersionId);
        Task<List<WorkSubmission>> GetWorkSubmissionsAsync(Dictionary<string, string> path);
        int[] ConvertDictionaryToVersionPairs(Dictionary<string, string> path);
    }
}