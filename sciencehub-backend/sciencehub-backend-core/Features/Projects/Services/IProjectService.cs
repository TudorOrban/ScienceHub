using sciencehub_backend_core.Features.Projects.DTO;
using sciencehub_backend_core.Features.Projects.Models;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Projects.Services
{
    public interface IProjectService
    {
        Task<PaginatedResults<ProjectSearchDTO>> GetProjectsByUserIdAsync(Guid userId, SearchParams searchParams);
        Task<Project> GetProjectByIdAsync(int projectId);
        Task<Project> CreateProjectAsync(CreateProjectDTO createProjectDTO);

        Task<int> DeleteProjectAsync(int projectId);
    }
}