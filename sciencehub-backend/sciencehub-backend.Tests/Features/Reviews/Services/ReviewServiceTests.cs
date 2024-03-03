using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Moq;
using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Data;
using sciencehub_backend.Features.Reviews.Dto;
using sciencehub_backend.Features.Reviews.Services;
using sciencehub_backend.Shared.Sanitation;
using sciencehub_backend.Shared.Validation;

namespace sciencehub_backend.Tests.Features.Reviews.Services
{
    public class ReviewServiceTests
    {

        private readonly AppDbContext _context;
        private readonly IReviewService _reviewService;
        private readonly Mock<ILogger<ReviewService>> _loggerMock;
        private readonly Mock<ISanitizerService> _sanitizerServiceMock;
        private readonly Mock<IDatabaseValidation> _databaseValidationMock;

        public ReviewServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb_Review")
                .ConfigureWarnings(warnings => 
                    warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning)) // Ignore the transaction warning for in-memory database
                .Options;
            
            _context = new AppDbContext(options);

            _sanitizerServiceMock = new Mock<ISanitizerService>();
            _databaseValidationMock = new Mock<IDatabaseValidation>();
            _loggerMock = new Mock<ILogger<ReviewService>>();

            // Setup
            _sanitizerServiceMock.Setup(s => s.Sanitize(It.IsAny<string>())).Returns<string>(input => input);

            // Construct service
            _reviewService = new ReviewService(_context, _loggerMock.Object, _sanitizerServiceMock.Object, _databaseValidationMock.Object);
        }

        // Tests
        [Fact]
        public async Task CreateProjectReviewAsync_ShouldCreateProjectReview()
        {
            // Arrange
            var userId = Guid.NewGuid();
            SetupDatabaseValidationMock(userId);
            SeedUserData(userId);
            var userIdString = userId.ToString();

            var createReviewDto = new CreateReviewDto
            {
                ReviewObjectType = "Project",
                ProjectId = 1,
                Title = "Test Project Review",
                Description = "Test Project Review Description",
                Users = new List<string>()
                {
                    userIdString
                },
                Public = true
            };

            // Act
            var projectReview = await _reviewService.CreateProjectReviewAsync(createReviewDto);

            // Assert
            Assert.NotNull(projectReview);
            Assert.Equal("Test Project Review", projectReview.Title);
            Assert.Equal("Test Project Review Description", projectReview.Description);
            Assert.True(projectReview.Public);

            var actualUserIds = projectReview.ProjectReviewUsers.Select(pu => pu.UserId.ToString()).ToList();
            var expectedUserIds = new List<string>() { userIdString };
            Assert.Equal(expectedUserIds, actualUserIds);
        }

        [Fact]
        public async Task CreateWorkReviewAsync_ShouldCreateWorkReview()
        {
            // Arrange
            var userId = Guid.NewGuid();
            SetupDatabaseValidationMock(userId);
            SeedUserData(userId);
            var userIdString = userId.ToString();

            var createReviewDto = new CreateReviewDto
            {
                ReviewObjectType = "Work",
                WorkId = 1,
                WorkType = "Paper",
                Title = "Test Work Review",
                Description = "Test Work Review Description",
                Users = new List<string>()
                {
                    userIdString
                },
                Public = true
            };

            // Act
            var workReview = await _reviewService.CreateWorkReviewAsync(createReviewDto);

            // Assert
            Assert.NotNull(workReview);
            Assert.Equal("Test Work Review", workReview.Title);
            Assert.Equal("Test Work Review Description", workReview.Description);
            Assert.True(workReview.Public);

            var actualUserIds = workReview.WorkReviewUsers.Select(pu => pu.UserId.ToString()).ToList();
            var expectedUserIds = new List<string>() { userIdString };
            Assert.Equal(expectedUserIds, actualUserIds);
        }

        // Utils
        private void SeedUserData(Guid userId)
        {
            _context.Users.Add(new User
            {
                Id = userId,
                FullName = "Test User",
                Username = "testuser"
            });
            _context.SaveChanges();
        }

        private void SetupDatabaseValidationMock(Guid userId)
        {
            _databaseValidationMock.Setup(m => m.ValidateUserId(It.IsAny<string>()))
                .ReturnsAsync(userId);
        }
    }
}
