using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Reviews.Services
{
    public interface IProjectReviewService
    {
        Task<ProjectReview> GetProjectReviewByIdAsync(int reviewId);
        Task<List<ProjectReview>> GetProjectReviewsByProjectIdAsync(int projectId);
        Task<PaginatedResults<ProjectReviewSearchDTO>> SearchProjectReviewsByProjectIdAsync(int projectId, SearchParams searchParams, bool? small = true);
        Task<ProjectReview> CreateProjectReviewAsync(CreateReviewDTO createReviewDTO);
        Task<ProjectReview> UpdateProjectReviewAsync(int reviewId, UpdateReviewDTO updateReviewDTO);
    }
}