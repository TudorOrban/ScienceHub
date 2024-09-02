using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Issues.Repositories
{
    public interface IProjectIssueRepository
    {
        Task<PaginatedResults<ProjectIssue>> SearchProjectIssuesByProjectIdAsync(int projectId, SearchParams searchParams);
    }
}