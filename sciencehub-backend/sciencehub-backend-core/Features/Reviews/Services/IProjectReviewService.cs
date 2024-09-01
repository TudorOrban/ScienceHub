using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Reviews.Services
{
    public interface IProjectReviewService
    {
        Task<PaginatedResults<ProjectReviewSearchDTO>> SearchProjectReviewsByProjectIdAsync(int projectId, SearchParams searchParams, bool? small = true);
    }
}