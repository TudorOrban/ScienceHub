using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Reviews.Repositories
{
    public interface IWorkReviewRepository
    {
        Task<WorkReview> FindWorkReviewByIdAsync(int reviewId);
        Task<PaginatedResults<WorkReview>> SearchWorkReviewsByWorkIdAsync(int workId, WorkType workType, SearchParams searchParams);
        Task<List<WorkReview>> FindWorkReviewsByWorkIdAsync(int workId, WorkType workType);
        Task<WorkReview> CreateWorkReviewAsync(WorkReview newWorkReview, IEnumerable<string> userIdStrings);
        Task<WorkReview> UpdateWorkReviewAsync(WorkReview workReview);
        Task<int> DeleteWorkReviewAsync(int reviewId);
    }
}