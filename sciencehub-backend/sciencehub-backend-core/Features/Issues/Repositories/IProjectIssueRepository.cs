using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Issues.Repositories
{
    public interface IProjectIssueRepository
    {
        Task<ProjectIssue> FindProjectIssueByIdAsync(int issueId);
        Task<PaginatedResults<ProjectIssue>> SearchProjectIssuesByProjectIdAsync(int projectId, SearchParams searchParams);
        Task<List<ProjectIssue>> FindProjectIssuesByProjectIdAsync(int projectId);
        Task<ProjectIssue> CreateProjectIssueAsync(ProjectIssue newProjectIssue, IEnumerable<string> userIdStrings);
        Task<ProjectIssue> UpdateProjectIssueAsync(ProjectIssue projectIssue);
        Task<int> DeleteProjectIssueAsync(int issueId);
    }
}