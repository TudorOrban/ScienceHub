using sciencehub_backend_core.Features.Issues.DTOs;
using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Issues.Services
{
    public interface IProjectIssueService
    {
        Task<ProjectIssue> GetProjectIssueByIdAsync(int issueId);
        Task<List<ProjectIssue>> GetProjectIssuesByProjectIdAsync(int projectId);
        Task<PaginatedResults<ProjectIssueSearchDTO>> SearchProjectIssuesByProjectIdAsync(int projectId, SearchParams searchParams, bool? small = true);
        Task<ProjectIssue> CreateProjectIssueAsync(CreateIssueDTO createIssueDTO);
        Task<ProjectIssue> UpdateProjectIssueAsync(UpdateIssueDTO updateIssueDTO);
        Task<int> DeleteProjectIssueAsync(int issueId);
    }
}