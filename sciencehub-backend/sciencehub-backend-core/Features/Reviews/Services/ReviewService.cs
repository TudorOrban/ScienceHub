using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Reviews.Dto;
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

        public async Task<int> CreateReviewAsync(CreateReviewDto createReviewDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                int reviewId = 0;
                
                switch (createReviewDto.ReviewObjectType)
                {
                    case "Project":
                        var projectReview = await CreateProjectReviewAsync(createReviewDto);
                        reviewId = projectReview.Id;
                        break;
                    case "Work":
                        var workReview = await CreateWorkReviewAsync(createReviewDto);
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

        public async Task<ProjectReview> CreateProjectReviewAsync(CreateReviewDto createReviewDto)
        {
            var projectId = await _databaseValidation.ValidateProjectId(createReviewDto.ProjectId);
            var newProjectReview = new ProjectReview
            {
                ProjectId = projectId,
                Title = _sanitizerService.Sanitize(createReviewDto.Title),
                Description = _sanitizerService.Sanitize(createReviewDto.Description),
                Public = createReviewDto.Public,
            };
            _context.ProjectReviews.Add(newProjectReview);
            await _context.SaveChangesAsync();

            await AddUsersToReviewAsync(createReviewDto.Users, newProjectReview.Id, "Project");
            return newProjectReview;
        }

        public async Task<WorkReview> CreateWorkReviewAsync(CreateReviewDto createReviewDto)
        {
            if (createReviewDto.WorkId == null)
            {
                throw new InvalidWorkIdException();
            }
            var workId = createReviewDto.WorkId.Value;
            var workTypeEnum = EnumParser.ParseWorkType(createReviewDto.WorkType);
            if (!workTypeEnum.HasValue)
            {
                throw new InvalidWorkTypeException();
            }

            var newWorkReview = new WorkReview
            {
                WorkId = workId,
                WorkType = workTypeEnum.Value,
                Title = _sanitizerService.Sanitize(createReviewDto.Title),
                Description = _sanitizerService.Sanitize(createReviewDto.Description),
                Public = createReviewDto.Public,
            };
            _context.WorkReviews.Add(newWorkReview);
            await _context.SaveChangesAsync();

            await AddUsersToReviewAsync(createReviewDto.Users, newWorkReview.Id, "Work");
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
    }
}