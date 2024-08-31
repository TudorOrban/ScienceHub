using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Shared.Validation
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