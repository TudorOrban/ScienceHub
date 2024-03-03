using sciencehub_backend.Features.Issues.Dto;

namespace sciencehub_backend.Features.Issues.Services
{
    public interface IIssueService
    {
        Task<int> CreateIssueAsync(CreateIssueDto createIssueDto, SanitizerService sanitizerService);
    }
}