using sciencehub_backend_core.Features.Projects.Dto;
using sciencehub_backend_core.Features.Projects.Models;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Projects.Services
{
    public interface IProjectService
    {
        Task<PaginatedResults<ProjectSearchDTO>> GetProjectsByUserIdAsync(Guid userId, string searchTerm, int page, int pageSize, string sortBy, bool sortDescending);
        Task<Project> GetProjectByIdAsync(int projectId);
        Task<Project> CreateProjectAsync(CreateProjectDto createProjectDto);

        Task<int> DeleteProjectAsync(int projectId);
    }
}