using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Features.Reviews.Repositories;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;
using sciencehub_backend_core.Shared.Validation;

namespace sciencehub_backend_core.Features.Reviews.Services
{
    public class WorkReviewService : IWorkReviewService
    {
        private readonly IWorkReviewRepository _workReviewRepository;
        private readonly SanitizerService _sanitizerService;

        public WorkReviewService(IWorkReviewRepository workReviewRepository, SanitizerService sanitizerService)
        {
            _workReviewRepository = workReviewRepository;
            _sanitizerService = sanitizerService;
        }

        public async Task<WorkReview> GetWorkReviewByIdAsync(int reviewId)
        {
            return await _workReviewRepository.FindWorkReviewByIdAsync(reviewId);
        }

        public async Task<List<WorkReview>> GetWorkReviewsByWorkIdAsync(int workId, WorkType workType)
        {
            return await _workReviewRepository.FindWorkReviewsByWorkIdAsync(workId, workType);
        }

        public async Task<PaginatedResults<WorkReviewSearchDTO>> SearchWorkReviewsByWorkIdAsync(int workId, WorkType workType, SearchParams searchParams, bool? small = true)
        {
            var reviews = await _workReviewRepository.SearchWorkReviewsByWorkIdAsync(workId, workType, searchParams);

            return new PaginatedResults<WorkReviewSearchDTO>
            {
                Results = reviews.Results.Select(r => MapToWorkReviewSearchDTO(r, small)).ToList(),
                TotalCount = reviews.TotalCount
            };
        }

        private WorkReviewSearchDTO MapToWorkReviewSearchDTO(WorkReview r, bool? small)
        {
            var reviewDTO = new WorkReviewSearchDTO
            {
                Id = r.Id,
                WorkId = r.WorkId,
                Title = r.Title,
                Description = r.Description,                    
                CreatedAt = r.CreatedAt,
            };

            if (small.HasValue && !small.Value)
            {
                reviewDTO.WorkReviewUsers = r.WorkReviewUsers.ToList();
            }

            return reviewDTO;
        }

        public async Task<WorkReview> CreateWorkReviewAsync(CreateReviewDTO createReviewDTO)
        {
            if (createReviewDTO.WorkId == null || !createReviewDTO.WorkId.HasValue)
            {
                throw new InvalidWorkIdException();
            }
            var newWorkReview = new WorkReview
            {
                WorkId = createReviewDTO.WorkId.Value,
                Title = _sanitizerService.Sanitize(createReviewDTO.Title),
                Description = _sanitizerService.Sanitize(createReviewDTO.Description),
                Public = createReviewDTO.Public,
            };

            await _workReviewRepository.CreateWorkReviewAsync(newWorkReview, createReviewDTO.Users);

            return newWorkReview;
        }

        public async Task<WorkReview> UpdateWorkReviewAsync(UpdateReviewDTO updateReviewDTO)
        {
            var workReview = await _workReviewRepository.FindWorkReviewByIdAsync(updateReviewDTO.Id);

            workReview.Title = _sanitizerService.Sanitize(updateReviewDTO.Title);
            workReview.Description = _sanitizerService.Sanitize(updateReviewDTO.Description);
            workReview.Public = updateReviewDTO.Public;

            await _workReviewRepository.UpdateWorkReviewAsync(workReview);
            return workReview;
        }

        public async Task<int> DeleteWorkReviewAsync(int reviewId)
        {
            var review = await _workReviewRepository.FindWorkReviewByIdAsync(reviewId);
            if (review == null)
            {
                throw new InvalidWorkReviewIdException();
            }

            return await _workReviewRepository.DeleteWorkReviewAsync(reviewId);
        }

    }
}