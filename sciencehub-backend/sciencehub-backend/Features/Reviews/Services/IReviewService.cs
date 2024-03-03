using sciencehub_backend.Features.Reviews.Dto;
using sciencehub_backend.Features.Reviews.Models;

namespace sciencehub_backend.Features.Reviews.Services
{
    public interface IReviewService
    {
        Task<int> CreateReviewAsync(CreateReviewDto createReviewDto);
        Task<ProjectReview> CreateProjectReviewAsync(CreateReviewDto createReviewDto);
        Task<WorkReview> CreateWorkReviewAsync(CreateReviewDto createReviewDto);
    }
}