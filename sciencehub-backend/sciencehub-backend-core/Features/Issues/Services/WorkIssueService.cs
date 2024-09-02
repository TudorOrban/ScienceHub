using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Issues.DTOs;
using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Features.Issues.Repositories;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Sanitation;
using sciencehub_backend_core.Shared.Search;
using sciencehub_backend_core.Shared.Validation;

namespace sciencehub_backend_core.Features.Issues.Services
{
    public class WorkIssueService : IWorkIssueService
    {
        private readonly IWorkIssueRepository _workIssueRepository;
        private readonly ISanitizerService _sanitizerService;

        public WorkIssueService(IWorkIssueRepository workIssueRepository, ISanitizerService sanitizerService)
        {
            _workIssueRepository = workIssueRepository;
            _sanitizerService = sanitizerService;
        }

        public async Task<WorkIssue> GetWorkIssueByIdAsync(int issueId)
        {
            return await _workIssueRepository.FindWorkIssueByIdAsync(issueId);
        }

        public async Task<List<WorkIssue>> GetWorkIssuesByWorkIdAsync(int workId, WorkType workType)
        {
            return await _workIssueRepository.FindWorkIssuesByWorkIdAsync(workId, workType);
        }

        public async Task<PaginatedResults<WorkIssueSearchDTO>> SearchWorkIssuesByWorkIdAsync(int workId, WorkType workType, SearchParams searchParams, bool? small = true)
        {
            var issues = await _workIssueRepository.SearchWorkIssuesByWorkIdAsync(workId, workType, searchParams);

            return new PaginatedResults<WorkIssueSearchDTO>
            {
                Results = issues.Results.Select(r => MapToWorkIssueSearchDTO(r, small)).ToList(),
                TotalCount = issues.TotalCount
            };
        }

        private WorkIssueSearchDTO MapToWorkIssueSearchDTO(WorkIssue r, bool? small)
        {
            var issueDTO = new WorkIssueSearchDTO
            {
                Id = r.Id,
                WorkId = r.WorkId,
                Title = r.Title,
                Description = r.Description,                    
                CreatedAt = r.CreatedAt,
            };

            if (small.HasValue && !small.Value)
            {
                issueDTO.WorkIssueUsers = r.WorkIssueUsers.ToList();
            }

            return issueDTO;
        }

        public async Task<WorkIssue> CreateWorkIssueAsync(CreateIssueDTO createIssueDTO)
        {
            if (createIssueDTO.WorkId == null || !createIssueDTO.WorkId.HasValue)
            {
                throw new InvalidWorkIdException();
            }
            var newWorkIssue = new WorkIssue
            {
                WorkId = createIssueDTO.WorkId.Value,
                Title = _sanitizerService.Sanitize(createIssueDTO.Title),
                Description = _sanitizerService.Sanitize(createIssueDTO.Description),
                Public = createIssueDTO.Public,
            };

            await _workIssueRepository.CreateWorkIssueAsync(newWorkIssue, createIssueDTO.Users);

            return newWorkIssue;
        }

        public async Task<WorkIssue> UpdateWorkIssueAsync(UpdateIssueDTO updateIssueDTO)
        {
            var workIssue = await _workIssueRepository.FindWorkIssueByIdAsync(updateIssueDTO.Id);

            workIssue.Title = _sanitizerService.Sanitize(updateIssueDTO.Title);
            workIssue.Description = _sanitizerService.Sanitize(updateIssueDTO.Description);
            workIssue.Public = updateIssueDTO.Public;

            await _workIssueRepository.UpdateWorkIssueAsync(workIssue);
            return workIssue;
        }

        public async Task<int> DeleteWorkIssueAsync(int issueId)
        {
            var issue = await _workIssueRepository.FindWorkIssueByIdAsync(issueId);
            if (issue == null)
            {
                throw new InvalidWorkIssueIdException();
            }

            return await _workIssueRepository.DeleteWorkIssueAsync(issueId);
        }

    }
}