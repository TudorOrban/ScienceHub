using sciencehub_backend.Features.Reviews.Dto;

namespace sciencehub_backend.Features.Reviews.Services
{
    public interface IReviewService
    {
        Task<int> CreateReviewAsync(CreateReviewDto createReviewDto);
    }
}