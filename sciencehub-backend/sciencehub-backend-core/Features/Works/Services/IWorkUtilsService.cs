using sciencehub_backend_core.Core.Users.Models;
using sciencehub_backend_core.Features.Works.Models;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.Works.Services
{
    public interface IWorkUtilsService
    {
        Task<(WorkBase work, IEnumerable<WorkUserDto> workUsers)> GetWorkAsync(int workId, WorkType workType);
        WorkBase CreateWorkType(string workType);
        Task AddWorkUsersAsync(int workId, List<string> userIds, string workType);
        Task AddWorkProjectAsync(int workId, int projId, string workType);
    }
}