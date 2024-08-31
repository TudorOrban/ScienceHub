using sciencehub_backend_core.Features.Submissions.Dto;
using sciencehub_backend_core.Features.Submissions.Models;

namespace sciencehub_backend_core.Features.Submissions.Services
{
    public interface ISubmissionService
    {
        Task<WorkSubmission> GetWorkSubmissionAsync(int workSubmissionId);    
        Task<int> CreateSubmissionAsync(CreateSubmissionDto createSubmissionDto);

    
    
    }
}