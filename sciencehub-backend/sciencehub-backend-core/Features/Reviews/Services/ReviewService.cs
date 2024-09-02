using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Shared.Enums;

namespace sciencehub_backend_core.Features.Reviews.Services
{
    public class ReviewService : IReviewService
    {
        private readonly ProjectReviewService _projectReviewService;
        private readonly WorkReviewService _workReviewService;
        private readonly ILogger<ReviewService> _logger;

        public ReviewService(
            ProjectReviewService projectReviewService,
            WorkReviewService workReviewService,
            ILogger<ReviewService> logger)
        {
            _projectReviewService = projectReviewService;
            _workReviewService = workReviewService;
            _logger = logger;
        }

        public async Task<List<WorkReview>> GetWorkReviewsByWorkIdAsync(int workId, WorkType workType)
        {
            return await _workReviewService.GetWorkReviewsByWorkIdAsync(workId, workType);
        }

        public async Task<int> CreateReviewAsync(CreateReviewDTO createReviewDTO)
        {
            try
            {
                int reviewId = 0;
                
                switch (createReviewDTO.ReviewObjectType)
                {
                    case "Project":
                        var projectReview = await _projectReviewService.CreateProjectReviewAsync(createReviewDTO);
                        reviewId = projectReview.Id;
                        break;
                    case "Work":
                        var workReview = await _workReviewService.CreateWorkReviewAsync(createReviewDTO);
                        reviewId = workReview.Id;
                        break;
                    default:
                        throw new ArgumentException("Invalid ReviewObjectType");

                }

                return reviewId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating review.");
                throw;
            }
        }

        public async Task<int> UpdateReviewAsync(UpdateReviewDTO updateReviewDTO)
        {
            try
            {
                switch (updateReviewDTO.ReviewObjectType)
                {
                    case "Project":
                        var projectReview = await _projectReviewService.UpdateProjectReviewAsync(updateReviewDTO.ProjectId ?? 0, updateReviewDTO);
                        return projectReview.Id;
                    case "Work":
                        var workReview = await _workReviewService.UpdateWorkReviewAsync(updateReviewDTO.WorkId ?? 0, updateReviewDTO);
                        return workReview.Id;
                    default:
                        throw new ArgumentException("Invalid ReviewObjectType");

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating review.");
                throw;
            }
        }

        public async Task<int> DeleteReviewAsync(int reviewId, string reviewType)
        {
            try
            {
                switch (reviewType)
                {
                    case "Project":
                        return await _projectReviewService.DeleteProjectReviewAsync(reviewId);
                    case "Work":
                        return await _workReviewService.DeleteWorkReviewAsync(reviewId);
                    default:
                        throw new ArgumentException("Invalid ReviewType");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting review.");
                throw;
            }
        }
    }
}