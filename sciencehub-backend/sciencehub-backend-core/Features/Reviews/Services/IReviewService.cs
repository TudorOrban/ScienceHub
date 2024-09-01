using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;

namespace sciencehub_backend_core.Features.Reviews.Services
{
    public interface IReviewService
    {
        Task<List<ProjectReview>> GetProjectReviewsByProjectIdAsync(int projectId);
        Task<List<WorkReview>> GetWorkReviewsByWorkIdAsync(int workId);
        Task<int> CreateReviewAsync(CreateReviewDTO createReviewDTO);
        Task<ProjectReview> CreateProjectReviewAsync(CreateReviewDTO createReviewDTO);
        Task<WorkReview> CreateWorkReviewAsync(CreateReviewDTO createReviewDTO);
        Task<int> UpdateReviewAsync(UpdateReviewDTO updateReviewDTO);
        Task<ProjectReview> UpdateProjectReviewAsync(int reviewId, UpdateReviewDTO updateReviewDTO);
        Task<WorkReview> UpdateWorkReviewAsync(int reviewId, UpdateReviewDTO updateReviewDTO);
        Task<int> DeleteReviewAsync(int reviewId, string reviewType);
    }
}