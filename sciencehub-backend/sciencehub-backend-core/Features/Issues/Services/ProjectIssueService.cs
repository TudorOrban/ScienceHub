using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Issues.DTOs;
using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Features.Issues.Repositories;
using sciencehub_backend_core.Shared.Search;
using sciencehub_backend_core.Shared.Validation;

namespace sciencehub_backend_core.Features.Issues.Services
{
    public class ProjectIssueService : IProjectIssueService
    {
        private readonly IProjectIssueRepository _projectIssueRepository;
        private readonly DatabaseValidation _databaseValidation;
        private readonly SanitizerService _sanitizerService;

        public ProjectIssueService(IProjectIssueRepository projectIssueRepository, DatabaseValidation databaseValidation, SanitizerService sanitizerService)
        {
            _projectIssueRepository = projectIssueRepository;
            _databaseValidation = databaseValidation;
            _sanitizerService = sanitizerService;
        }

        public async Task<ProjectIssue> GetProjectIssueByIdAsync(int issueId)
        {
            return await _projectIssueRepository.FindProjectIssueByIdAsync(issueId);
        }

        public async Task<List<ProjectIssue>> GetProjectIssuesByProjectIdAsync(int projectId)
        {
            return await _projectIssueRepository.FindProjectIssuesByProjectIdAsync(projectId);
        }

        public async Task<PaginatedResults<ProjectIssueSearchDTO>> SearchProjectIssuesByProjectIdAsync(int projectId, SearchParams searchParams, bool? small = true)
        {
            var issues = await _projectIssueRepository.SearchProjectIssuesByProjectIdAsync(projectId, searchParams);

            return new PaginatedResults<ProjectIssueSearchDTO>
            {
                Results = issues.Results.Select(r => MapToProjectIssueSearchDTO(r, small)).ToList(),
                TotalCount = issues.TotalCount
            };
        }

        private ProjectIssueSearchDTO MapToProjectIssueSearchDTO(ProjectIssue r, bool? small)
        {
            var issueDTO = new ProjectIssueSearchDTO
            {
                Id = r.Id,
                ProjectId = r.ProjectId,
                Title = r.Title,
                Description = r.Description,                    
                CreatedAt = r.CreatedAt,
            };

            if (small.HasValue && !small.Value)
            {
                issueDTO.ProjectIssueUsers = r.ProjectIssueUsers.ToList();
            }

            return issueDTO;
        }

        public async Task<ProjectIssue> CreateProjectIssueAsync(CreateIssueDTO createIssueDTO)
        {
            var projectId = await _databaseValidation.ValidateProjectId(createIssueDTO.ProjectId);
            var newProjectIssue = new ProjectIssue
            {
                ProjectId = projectId,
                Title = _sanitizerService.Sanitize(createIssueDTO.Title),
                Description = _sanitizerService.Sanitize(createIssueDTO.Description),
                Public = createIssueDTO.Public,
            };

            await _projectIssueRepository.CreateProjectIssueAsync(newProjectIssue, createIssueDTO.Users);

            return newProjectIssue;
        }

        public async Task<ProjectIssue> UpdateProjectIssueAsync(UpdateIssueDTO updateIssueDTO)
        {
            var projectIssue = await _projectIssueRepository.FindProjectIssueByIdAsync(updateIssueDTO.Id);

            projectIssue.Title = _sanitizerService.Sanitize(updateIssueDTO.Title);
            projectIssue.Description = _sanitizerService.Sanitize(updateIssueDTO.Description);
            projectIssue.Public = updateIssueDTO.Public;

            await _projectIssueRepository.UpdateProjectIssueAsync(projectIssue);
            return projectIssue;
        }

        public async Task<int> DeleteProjectIssueAsync(int issueId)
        {
            var issue = await _projectIssueRepository.FindProjectIssueByIdAsync(issueId);
            if (issue == null)
            {
                throw new InvalidProjectIssueIdException();
            }

            return await _projectIssueRepository.DeleteProjectIssueAsync(issueId);
        }

    }
}