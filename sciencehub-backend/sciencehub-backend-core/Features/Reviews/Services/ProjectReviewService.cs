using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Features.Reviews.Repositories;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Reviews.Services
{
    public class ProjectReviewService : IProjectReviewService
    {
        private readonly IProjectReviewRepository _projectReviewRepository;

        public ProjectReviewService(IProjectReviewRepository projectReviewRepository)
        {
            _projectReviewRepository = projectReviewRepository;
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
    }
}