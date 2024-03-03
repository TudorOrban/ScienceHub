using sciencehub_backend.Features.Metrics.Research.Models;
using sciencehub_backend.Features.Metrics.Research.Services;

namespace sciencehub_backend.Features.Metrics
{
    public class ResearchMetricsCalculator : IResearchMetricsCalculator
    {

        public async Task<float> FindWorkResearchScore(int workId, string workType, int? depth = 1)
        {
            WorkWithCitationDepth work = await FetchWorkCitationsWithDepth(workId, workType, depth);

            return ComputeResearchScore(work, depth);
        }

        public async Task<WorkWithCitationDepth> FetchWorkCitationsWithDepth(int workId, string workType, int? depth = 1)
        {
            // Assume depth 1 for now
            // 1. Look for all work_citations with target (work_id, work_type) prescribed
            // 2. Take their source (work_id, work_type) and fetch all corresponding works
            return new WorkWithCitationDepth
            {
                Id = workId,
                WorkType = workType,
                Citations = new List<Citation>()
            };
        }

        public float ComputeResearchScore(WorkWithCitationDepth work, int? depth = 1)
        {
            float researchScore = 0;
            foreach (var citation in work.Citations)
            {
                // For each citation, compute the source works' total citations
                if (citation.SourceWorks != null)
                {
                    int totalCitations = 0;
                    foreach (var sourceWork in citation.SourceWorks)
                    {
                        totalCitations += sourceWork.CitationsCount;
                    }
                    researchScore += totalCitations;
                }
            }

            return researchScore / 100;
        }

        // TODO: Rethink this, work cannot have an h-index
        public void FindUserHIndex(int workId, string workType, int? depth = 1)
        {
            
        }

        public int ComputeHIndex(List<WorkWithCitations> works)
        {
            works = works.OrderByDescending(w => w.CitationsCount).ToList();
            int hIndex = 0;
            for (int i = 0; i < works.Count; i++)
            {
                if (works[i].CitationsCount > i)
                {
                    hIndex++;
                }
            }

            return hIndex;
        }

    }
}