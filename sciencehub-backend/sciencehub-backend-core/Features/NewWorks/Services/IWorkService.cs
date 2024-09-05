using sciencehub_backend_core.Features.NewWorks.DTO;
using sciencehub_backend_core.Features.NewWorks.DTOs;
using sciencehub_backend_core.Features.NewWorks.Models;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.NewWorks.Services
{
    public interface IWorkService
    {
        Task<Work> GetWorkAsync(int workId);
        Task<IEnumerable<WorkSearchDTO>> GetWorksByUserIdAsync(Guid userId);
        Task<IEnumerable<WorkSearchDTO>> GetWorksByProjectIdAsync(int projectId);
        Task<IEnumerable<WorkSearchDTO>> GetWorksByTypeAndUserIdAsync(WorkType type, Guid userId);
        Task<IEnumerable<WorkSearchDTO>> GetWorksByTypeAndProjectIdAsync(WorkType type, int projectId);
        Task<Work> CreateWorkAsync(CreateWorkDTO workDTO);
        Task<Work> UpdateWorkAsync(UpdateWorkDTO workDTO);
        Task DeleteWorkAsync(int workId);
    }
}