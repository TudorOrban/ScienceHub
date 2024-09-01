using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;

namespace sciencehub_backend_core.Features.Reviews.Services
{
    public interface IReviewService
    {
        Task<List<ProjectReview>> GetProjectReviewsByProjectIdAsync(int projectId);
        Task<List<WorkReview>> GetWorkReviewsByWorkIdAsync(int workId);
        Task<int> CreateReviewAsync(CreateReviewDTO createReviewDto);
        Task<ProjectReview> CreateProjectReviewAsync(CreateReviewDTO createReviewDto);
        Task<WorkReview> CreateWorkReviewAsync(CreateReviewDTO createReviewDto);
        Task<int> UpdateReviewAsync(UpdateReviewDTO updateReviewDto);
        Task<ProjectReview> UpdateProjectReviewAsync(int reviewId, UpdateReviewDTO updateReviewDto);
        Task<WorkReview> UpdateWorkReviewAsync(int reviewId, UpdateReviewDTO updateReviewDto);
        Task<int> DeleteReviewAsync(int reviewId, string reviewType);
    }
}