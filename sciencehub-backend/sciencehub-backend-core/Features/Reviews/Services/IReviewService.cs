using sciencehub_backend_core.Features.Reviews.Dto;
using sciencehub_backend_core.Features.Reviews.Models;

namespace sciencehub_backend_core.Features.Reviews.Services
{
    public interface IReviewService
    {
        Task<int> CreateReviewAsync(CreateReviewDto createReviewDto);
        Task<ProjectReview> CreateProjectReviewAsync(CreateReviewDto createReviewDto);
        Task<WorkReview> CreateWorkReviewAsync(CreateReviewDto createReviewDto);
    }
}