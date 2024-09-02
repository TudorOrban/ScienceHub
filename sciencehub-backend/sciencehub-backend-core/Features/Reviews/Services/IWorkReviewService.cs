using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Reviews.Services
{
    public interface IWorkReviewService
    {
        Task<WorkReview> GetWorkReviewByIdAsync(int reviewId);
        Task<List<WorkReview>> GetWorkReviewsByWorkIdAsync(int workId, WorkType workType);
        Task<PaginatedResults<WorkReviewSearchDTO>> SearchWorkReviewsByWorkIdAsync(int workId, WorkType workType, SearchParams searchParams, bool? small = true);
        Task<WorkReview> CreateWorkReviewAsync(CreateReviewDTO createReviewDTO);
        Task<WorkReview> UpdateWorkReviewAsync(UpdateReviewDTO updateReviewDTO);
        Task<int> DeleteWorkReviewAsync(int reviewId);
    }
}