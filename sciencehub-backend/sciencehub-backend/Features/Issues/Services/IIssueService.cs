using sciencehub_backend.Features.Issues.Dto;
using sciencehub_backend.Features.Issues.Models;

namespace sciencehub_backend.Features.Issues.Services
{
    public interface IIssueService
    {
        Task<int> CreateIssueAsync(CreateIssueDto createIssueDto);
        Task<ProjectIssue> CreateProjectIssueAsync(CreateIssueDto createIssueDto);
        Task<WorkIssue> CreateWorkIssueAsync(CreateIssueDto createIssueDto);
    }
}