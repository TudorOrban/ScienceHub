using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Issues.Repositories
{
    public interface IWorkIssueRepository
    {
        Task<WorkIssue> FindWorkIssueByIdAsync(int issueId);
        Task<PaginatedResults<WorkIssue>> SearchWorkIssuesByWorkIdAsync(int workId, WorkType workType, SearchParams searchParams);
        Task<List<WorkIssue>> FindWorkIssuesByWorkIdAsync(int workId, WorkType workType);
        Task<WorkIssue> CreateWorkIssueAsync(WorkIssue newWorkIssue, IEnumerable<string> userIdStrings);
        Task<WorkIssue> UpdateWorkIssueAsync(WorkIssue workIssue);
        Task<int> DeleteWorkIssueAsync(int issueId);
    }
}