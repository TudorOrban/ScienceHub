using sciencehub_backend.Features.Works.Dto;
using sciencehub_backend.Features.Works.Models;

namespace sciencehub_backend.Features.Works.Services
{
    public interface IWorkService
    {
        Task<WorkBase> CreateWorkAsync(CreateWorkDto createWorkDto);
    }
}