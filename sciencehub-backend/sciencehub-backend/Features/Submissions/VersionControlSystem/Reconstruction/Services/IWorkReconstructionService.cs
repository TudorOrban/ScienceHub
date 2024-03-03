using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Works.Models;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Services
{
    public interface IWorkReconstructionService
    {
        Task<WorkBase> FindWorkVersionData(int workId, string workType, int workVersionId);
        Task<List<WorkSubmission>> GetWorkSubmissionsAsync(Dictionary<string, string> path);
        int[] ConvertDictionaryToVersionPairs(Dictionary<string, string> path);
    }
}