using sciencehub_backend.Shared.Enums;

namespace sciencehub_backend.Shared.Validation
{
    public interface IDatabaseValidation
    {
        Task<Guid> ValidateUserId(string userIdString);
        Task<int> ValidateProjectId(int? projectId);
        Task<int> ValidateProjectSubmissionId(int? projectSubmissionId);
        Task<int> ValidateProjectVersionId(int? projectVersionId);
        Task<int> ValidateWorkVersionId(int? workVersionId, WorkType workType);
    }
}