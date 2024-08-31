using sciencehub_backend_core.Features.Works.Dto;
using sciencehub_backend_core.Features.Works.Models;

namespace sciencehub_backend_core.Features.Works.Services
{
    public interface IWorkService
    {
        Task<WorkBase> CreateWorkAsync(CreateWorkDto createWorkDto);
    }
}