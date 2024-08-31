using sciencehub_backend_core.Features.Issues.Dto;
using sciencehub_backend_core.Features.Issues.Models;

namespace sciencehub_backend_core.Features.Issues.Services
{
    public interface IIssueService
    {
        Task<int> CreateIssueAsync(CreateIssueDto createIssueDto);
        Task<ProjectIssue> CreateProjectIssueAsync(CreateIssueDto createIssueDto);
        Task<WorkIssue> CreateWorkIssueAsync(CreateIssueDto createIssueDto);
    }
}