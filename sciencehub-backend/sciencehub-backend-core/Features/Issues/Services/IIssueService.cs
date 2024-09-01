using sciencehub_backend_core.Features.Issues.DTOs;
using sciencehub_backend_core.Features.Issues.Models;

namespace sciencehub_backend_core.Features.Issues.Services
{
    public interface IIssueService
    {
        Task<List<ProjectIssue>> GetProjectIssuesByProjectIdAsync(int projectId);
        Task<List<WorkIssue>> GetWorkIssuesByWorkIdAsync(int workId);
        Task<int> CreateIssueAsync(CreateIssueDTO createIssueDTO);
        Task<ProjectIssue> CreateProjectIssueAsync(CreateIssueDTO createIssueDTO);
        Task<WorkIssue> CreateWorkIssueAsync(CreateIssueDTO createIssueDTO);
        Task<int> UpdateIssueAsync(UpdateIssueDTO updateIssueDTO);
        Task<ProjectIssue> UpdateProjectIssueAsync(UpdateIssueDTO updateIssueDTO);
        Task<WorkIssue> UpdateWorkIssueAsync(UpdateIssueDTO updateIssueDTO);
        Task<int> DeleteIssueAsync(int issueId, string issueType);
    }
}