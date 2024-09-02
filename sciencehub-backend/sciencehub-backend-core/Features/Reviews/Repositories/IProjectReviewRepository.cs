using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Reviews.Repositories
{
    public interface IProjectReviewRepository
    {
        Task<ProjectReview> FindProjectReviewByIdAsync(int reviewId);
        Task<PaginatedResults<ProjectReview>> SearchProjectReviewsByProjectIdAsync(int projectId, SearchParams searchParams);
        Task<List<ProjectReview>> FindProjectReviewsByProjectIdAsync(int projectId);
        Task<ProjectReview> CreateProjectReviewAsync(ProjectReview newProjectReview, IEnumerable<string> userIdStrings);
        Task<ProjectReview> UpdateProjectReviewAsync(ProjectReview projectReview);
    }
}