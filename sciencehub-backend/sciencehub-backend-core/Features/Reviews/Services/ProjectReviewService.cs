using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Features.Reviews.Repositories;
using sciencehub_backend_core.Shared.Search;
using sciencehub_backend_core.Shared.Validation;

namespace sciencehub_backend_core.Features.Reviews.Services
{
    public class ProjectReviewService : IProjectReviewService
    {
        private readonly IProjectReviewRepository _projectReviewRepository;
        private readonly DatabaseValidation _databaseValidation;
        private readonly SanitizerService _sanitizerService;

        public ProjectReviewService(IProjectReviewRepository projectReviewRepository, DatabaseValidation databaseValidation, SanitizerService sanitizerService)
        {
            _projectReviewRepository = projectReviewRepository;
            _databaseValidation = databaseValidation;
            _sanitizerService = sanitizerService;
        }

        public async Task<ProjectReview> GetProjectReviewByIdAsync(int reviewId)
        {
            return await _projectReviewRepository.FindProjectReviewByIdAsync(reviewId);
        }

        public async Task<List<ProjectReview>> GetProjectReviewsByProjectIdAsync(int projectId)
        {
            return await _projectReviewRepository.FindProjectReviewsByProjectIdAsync(projectId);
        }

        public async Task<PaginatedResults<ProjectReviewSearchDTO>> SearchProjectReviewsByProjectIdAsync(int projectId, SearchParams searchParams, bool? small = true)
        {
            var reviews = await _projectReviewRepository.SearchProjectReviewsByProjectIdAsync(projectId, searchParams);

            return new PaginatedResults<ProjectReviewSearchDTO>
            {
                Results = reviews.Results.Select(r => MapToProjectReviewSearchDTO(r, small)).ToList(),
                TotalCount = reviews.TotalCount
            };
        }

        private ProjectReviewSearchDTO MapToProjectReviewSearchDTO(ProjectReview r, bool? small)
        {
            var reviewDTO = new ProjectReviewSearchDTO
            {
                Id = r.Id,
                ProjectId = r.ProjectId,
                Title = r.Title,
                Description = r.Description,                    
                CreatedAt = r.CreatedAt,
            };

            if (small.HasValue && !small.Value)
            {
                reviewDTO.ProjectReviewUsers = r.ProjectReviewUsers.ToList();
            }

            return reviewDTO;
        }

        public async Task<ProjectReview> CreateProjectReviewAsync(CreateReviewDTO createReviewDTO)
        {
            var projectId = await _databaseValidation.ValidateProjectId(createReviewDTO.ProjectId);
            var newProjectReview = new ProjectReview
            {
                ProjectId = projectId,
                Title = _sanitizerService.Sanitize(createReviewDTO.Title),
                Description = _sanitizerService.Sanitize(createReviewDTO.Description),
                Public = createReviewDTO.Public,
            };

            await _projectReviewRepository.CreateProjectReviewAsync(newProjectReview, createReviewDTO.Users);

            return newProjectReview;
        }

        public async Task<ProjectReview> UpdateProjectReviewAsync(int reviewId, UpdateReviewDTO updateReviewDTO)
        {
            var projectReview = await _projectReviewRepository.FindProjectReviewByIdAsync(reviewId);

            projectReview.Title = _sanitizerService.Sanitize(updateReviewDTO.Title);
            projectReview.Description = _sanitizerService.Sanitize(updateReviewDTO.Description);
            projectReview.Public = updateReviewDTO.Public;

            await _projectReviewRepository.UpdateProjectReviewAsync(projectReview);
            return projectReview;
        }

        public async Task<int> DeleteProjectReviewAsync(int reviewId)
        {
            var review = await _projectReviewRepository.FindProjectReviewByIdAsync(reviewId);
            if (review == null)
            {
                throw new InvalidProjectReviewIdException();
            }
            
            return await _projectReviewRepository.DeleteProjectReviewAsync(reviewId);
        }

    }
}