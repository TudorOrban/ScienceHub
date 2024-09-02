using sciencehub_backend_core.Features.Issues.DTOs;
using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Issues.Services
{
    public interface IWorkIssueService
    {
        Task<WorkIssue> GetWorkIssueByIdAsync(int issueId);
        Task<List<WorkIssue>> GetWorkIssuesByWorkIdAsync(int workId, WorkType workType);
        Task<PaginatedResults<WorkIssueSearchDTO>> SearchWorkIssuesByWorkIdAsync(int workId, WorkType workType, SearchParams searchParams, bool? small = true);
        Task<WorkIssue> CreateWorkIssueAsync(CreateIssueDTO createIssueDTO);
        Task<WorkIssue> UpdateWorkIssueAsync(UpdateIssueDTO updateIssueDTO);
        Task<int> DeleteWorkIssueAsync(int issueId);
    }
}