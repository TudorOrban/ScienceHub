using sciencehub_backend.Data;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Features.Reviews.Dto;
using sciencehub_backend.Features.Reviews.Models;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Validation;

namespace sciencehub_backend.Features.Reviews.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ReviewService> _logger;
        private readonly IDatabaseValidation _databaseValidation;
        private readonly SanitizerService _sanitizerService;

        public ReviewService(AppDbContext context, ILogger<ReviewService> logger, SanitizerService sanitizerService, IDatabaseValidation databaseValidation)
        {
            _context = context;
            _logger = logger;
            _sanitizerService = sanitizerService;
            _databaseValidation = databaseValidation;
        }

        public async Task<int> CreateReviewAsync(CreateReviewDto createReviewDto)
        {
            // Use transaction
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Create project or work review
                switch (createReviewDto.ReviewObjectType)
                {
                    case "Project":
                        var projectId = await _databaseValidation.ValidateProjectId(createReviewDto.ProjectId);
                        // Create the project review
                        var newProjectReview = new ProjectReview
                        {
                            ProjectId = projectId,
                            Title = _sanitizerService.Sanitize(createReviewDto.Title),
                            Description = _sanitizerService.Sanitize(createReviewDto.Description),
                            Public = createReviewDto.Public,
                        };
                        _context.ProjectReviews.Add(newProjectReview);
                        await _context.SaveChangesAsync();

                        // Add the users to project review
                        foreach (var userIdString in createReviewDto.Users)
                        {
                            // Verify provided userId is valid UUID and exists in database
                            var userId = await _databaseValidation.ValidateUserId(userIdString);
                            _context.ProjectReviewUsers.Add(new ProjectReviewUser { ProjectReviewId = newProjectReview.Id, UserId = userId });
                        }
                        await _context.SaveChangesAsync();

                        // Commit the transaction
                        transaction.Commit();

                        return newProjectReview.Id;
                    case "Work":
                        // TODO: Add validation for (workId, workType)
                        var workId = createReviewDto.WorkId.Value;
                        var workTypeEnum = EnumParser.ParseWorkType(createReviewDto.WorkType);
                        if (!workTypeEnum.HasValue)
                        {
                            _logger.LogWarning($"Invalid workType string: {createReviewDto.WorkType}");
                            throw new InvalidWorkTypeException();
                        }
                        
                        // Create the work review
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

                        // Add the users to work review
                        foreach (var userIdString in createReviewDto.Users)
                        {
                            // Verify provided userId is valid UUID and exists in database
                            var userId = await _databaseValidation.ValidateUserId(userIdString);
                            _logger.LogInformation($"Adding user {userId} to work review {newWorkReview.Id}");
                            _context.WorkReviewUsers.Add(new WorkReviewUser { WorkReviewId = newWorkReview.Id, UserId = userId });
                        }
                        await _context.SaveChangesAsync();

                        // Commit the transaction
                        transaction.Commit();

                        return newWorkReview.Id;
                }
                return 0;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError(ex, "Error creating review.");
                throw;
            }
        }
    }
}