using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.Reviews.Services
{
    public interface IReviewService
    {
        Task<List<WorkReview>> GetWorkReviewsByWorkIdAsync(int workId, WorkType workType);
        Task<int> CreateReviewAsync(CreateReviewDTO createReviewDTO);
        Task<int> UpdateReviewAsync(UpdateReviewDTO updateReviewDTO);
        Task<int> DeleteReviewAsync(int reviewId, string reviewType);
    }
}