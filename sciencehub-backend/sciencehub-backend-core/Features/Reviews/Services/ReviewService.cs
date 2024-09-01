using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Reviews.DTOs;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Sanitation;
using sciencehub_backend_core.Shared.Validation;

namespace sciencehub_backend_core.Features.Reviews.Services
{
    public class ReviewService : IReviewService
    {
        private readonly CoreServiceDbContext _context;
        private readonly ILogger<ReviewService> _logger;
        private readonly IDatabaseValidation _databaseValidation;
        private readonly ISanitizerService _sanitizerService;

        public ReviewService(CoreServiceDbContext context, ILogger<ReviewService> logger, ISanitizerService sanitizerService, IDatabaseValidation databaseValidation)
        {
            _context = context;
            _logger = logger;
            _sanitizerService = sanitizerService;
            _databaseValidation = databaseValidation;
        }

        public async Task<List<ProjectReview>> GetProjectReviewsByProjectIdAsync(int projectId)
        {
            return await _context.ProjectReviews.Where(pr => pr.ProjectId == projectId).ToListAsync();
        }

        public async Task<List<WorkReview>> GetWorkReviewsByWorkIdAsync(int workId)
        {
            return await _context.WorkReviews.Where(wr => wr.WorkId == workId).ToListAsync();
        }

        public async Task<int> CreateReviewAsync(CreateReviewDTO createReviewDTO)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                int reviewId = 0;
                
                switch (createReviewDTO.ReviewObjectType)
                {
                    case "Project":
                        var projectReview = await CreateProjectReviewAsync(createReviewDTO);
                        reviewId = projectReview.Id;
                        break;
                    case "Work":
                        var workReview = await CreateWorkReviewAsync(createReviewDTO);
                        reviewId = workReview.Id;
                        break;
                    default:
                        throw new ArgumentException("Invalid ReviewObjectType");

                }

                transaction.Commit();
                return reviewId;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError(ex, "Error creating review.");
                throw;
            }
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
            _context.ProjectReviews.Add(newProjectReview);
            await _context.SaveChangesAsync();

            await AddUsersToReviewAsync(createReviewDTO.Users, newProjectReview.Id, "Project");
            return newProjectReview;
        }

        public async Task<WorkReview> CreateWorkReviewAsync(CreateReviewDTO createReviewDTO)
        {
            if (createReviewDTO.WorkId == null)
            {
                throw new InvalidWorkIdException();
            }
            var workId = createReviewDTO.WorkId.Value;
            var workTypeEnum = EnumParser.ParseWorkType(createReviewDTO.WorkType);
            if (!workTypeEnum.HasValue)
            {
                throw new InvalidWorkTypeException();
            }

            var newWorkReview = new WorkReview
            {
                WorkId = workId,
                WorkType = workTypeEnum.Value,
                Title = _sanitizerService.Sanitize(createReviewDTO.Title),
                Description = _sanitizerService.Sanitize(createReviewDTO.Description),
                Public = createReviewDTO.Public,
            };
            _context.WorkReviews.Add(newWorkReview);
            await _context.SaveChangesAsync();

            await AddUsersToReviewAsync(createReviewDTO.Users, newWorkReview.Id, "Work");
            return newWorkReview;
        }

        private async Task AddUsersToReviewAsync(IEnumerable<string> userIdStrings, int reviewId, string reviewType)
        {
            foreach (var userIdString in userIdStrings)
            {
                var userId = await _databaseValidation.ValidateUserId(userIdString);
                _logger.LogInformation($"Adding user {userId} to {reviewType.ToLower()} review {reviewId}");

                if (reviewType == "Project")
                {
                    _context.ProjectReviewUsers.Add(new ProjectReviewUser { ProjectReviewId = reviewId, UserId = userId });
                }
                else if (reviewType == "Work")
                {
                    _context.WorkReviewUsers.Add(new WorkReviewUser { WorkReviewId = reviewId, UserId = userId });
                }
            }
            await _context.SaveChangesAsync();
        }
        
        public async Task<int> UpdateReviewAsync(UpdateReviewDTO updateReviewDTO)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                switch (updateReviewDTO.ReviewObjectType)
                {
                    case "Project":
                        var projectReview = await UpdateProjectReviewAsync(updateReviewDTO.ProjectId ?? 0, updateReviewDTO);
                        transaction.Commit();
                        return projectReview.Id;
                    case "Work":
                        var workReview = await UpdateWorkReviewAsync(updateReviewDTO.WorkId ?? 0, updateReviewDTO);
                        transaction.Commit();
                        return workReview.Id;
                    default:
                        throw new ArgumentException("Invalid ReviewObjectType");

                }
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError(ex, "Error updating review.");
                throw;
            }
        }

        public async Task<ProjectReview> UpdateProjectReviewAsync(int reviewId, UpdateReviewDTO updateReviewDTO)
        {
            var projectReview = await _context.ProjectReviews.SingleOrDefaultAsync(pr => pr.Id == reviewId);
            if (projectReview == null)
            {
                throw new InvalidProjectReviewIdException();
            }

            projectReview.Title = _sanitizerService.Sanitize(updateReviewDTO.Title);
            projectReview.Description = _sanitizerService.Sanitize(updateReviewDTO.Description);
            projectReview.Public = updateReviewDTO.Public;

            await _context.SaveChangesAsync();
            return projectReview;
        }

        public async Task<WorkReview> UpdateWorkReviewAsync(int reviewId, UpdateReviewDTO updateReviewDTO)
        {
            var workReview = await _context.WorkReviews.SingleOrDefaultAsync(wr => wr.Id == reviewId);
            if (workReview == null)
            {
                throw new InvalidWorkReviewIdException();
            }

            workReview.Title = _sanitizerService.Sanitize(updateReviewDTO.Title);
            workReview.Description = _sanitizerService.Sanitize(updateReviewDTO.Description);
            workReview.Public = updateReviewDTO.Public;

            await _context.SaveChangesAsync();
            return workReview;
        }

        public async Task<int> DeleteReviewAsync(int reviewId, string reviewType)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                switch (reviewType)
                {
                    case "Project":
                        var projectReview = await _context.ProjectReviews.SingleOrDefaultAsync(pr => pr.Id == reviewId);
                        if (projectReview == null)
                        {
                            throw new InvalidProjectReviewIdException();
                        }
                        _context.ProjectReviews.Remove(projectReview);
                        break;
                    case "Work":
                        var workReview = await _context.WorkReviews.SingleOrDefaultAsync(wr => wr.Id == reviewId);
                        if (workReview == null)
                        {
                            throw new InvalidWorkReviewIdException();
                        }
                        _context.WorkReviews.Remove(workReview);
                        break;
                    default:
                        throw new ArgumentException("Invalid ReviewType");
                }

                await _context.SaveChangesAsync();
                transaction.Commit();
                return reviewId;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError(ex, "Error deleting review.");
                throw;
            }
        }
    }
}