using sciencehub_backend_core.Features.Metrics.Research.Models;

namespace sciencehub_backend_core.Features.Metrics.Research.Services
{
    public interface IResearchMetricsCalculator
    {
        Task<float> FindWorkResearchScore(int workId, string workType, int? depth = 1);
        Task<WorkWithCitationDepth> FetchWorkCitationsWithDepth(int workId, string workType, int? depth = 1);
        float ComputeResearchScore(WorkWithCitationDepth work, int? depth = 1);
        void FindUserHIndex(int workId, string workType, int? depth = 1);
        int ComputeHIndex(List<WorkWithCitations> works);
    }
}