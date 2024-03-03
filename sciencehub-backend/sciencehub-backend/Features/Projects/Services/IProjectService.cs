using sciencehub_backend.Features.Projects.Dto;
using sciencehub_backend.Features.Projects.Models;

namespace sciencehub_backend.Features.Projects.Services
{
    public interface IProjectService
    {
        Task<Project> CreateProjectAsync(CreateProjectDto createProjectDto);
    }
}