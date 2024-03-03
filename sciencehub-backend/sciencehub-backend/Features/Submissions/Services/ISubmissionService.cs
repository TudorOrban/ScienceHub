using sciencehub_backend.Features.Submissions.Dto;
using sciencehub_backend.Features.Submissions.Models;

namespace sciencehub_backend.Features.Submissions.Services
{
    public interface ISubmissionService
    {
        Task<WorkSubmission> GetWorkSubmissionAsync(int workSubmissionId);    
        Task<int> CreateSubmissionAsync(CreateSubmissionDto createSubmissionDto, SanitizerService sanitizerService);
        
    
    
    }
}