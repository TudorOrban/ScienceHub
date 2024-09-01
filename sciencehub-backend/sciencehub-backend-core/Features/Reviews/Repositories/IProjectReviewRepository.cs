using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Reviews.Repositories
{
    public interface IProjectReviewRepository
    {
        Task<PaginatedResults<ProjectReview>> SearchProjectReviewsByProjectIdAsync(int projectId, SearchParams searchParams);
    }
}