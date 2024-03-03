using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Moq;
using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Data;
using sciencehub_backend.Features.Issues.Dto;
using sciencehub_backend.Features.Issues.Services;
using sciencehub_backend.Shared.Sanitation;
using sciencehub_backend.Shared.Validation;

namespace sciencehub_backend.Tests.Features.Issues.Services
{
    public class IssueServiceTests
    {

        private readonly AppDbContext _context;
        private readonly IIssueService _issueService;
        private readonly Mock<ILogger<IssueService>> _loggerMock;
        private readonly Mock<ISanitizerService> _sanitizerServiceMock;
        private readonly Mock<IDatabaseValidation> _databaseValidationMock;

        public IssueServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb_Issue")
                .ConfigureWarnings(warnings => 
                    warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning)) // Ignore the transaction warning for in-memory database
                .Options;
            
            _context = new AppDbContext(options);

            _sanitizerServiceMock = new Mock<ISanitizerService>();
            _databaseValidationMock = new Mock<IDatabaseValidation>();
            _loggerMock = new Mock<ILogger<IssueService>>();

            // Setup
            _sanitizerServiceMock.Setup(s => s.Sanitize(It.IsAny<string>())).Returns<string>(input => input);

            // Construct service
            _issueService = new IssueService(_context, _loggerMock.Object, _sanitizerServiceMock.Object, _databaseValidationMock.Object);
        }

        // Tests
        [Fact]
        public async Task CreateProjectIssueAsync_ShouldCreateProjectIssue()
        {
            // Arrange
            var userId = Guid.NewGuid();
            SetupDatabaseValidationMock(userId);
            SeedUserData(userId);
            var userIdString = userId.ToString();

            var createIssueDto = new CreateIssueDto
            {
                IssueObjectType = "Project",
                ProjectId = 1,
                Title = "Test Project Issue",
                Description = "Test Project Issue Description",
                Users = new List<string>()
                {
                    userIdString
                },
                Public = true
            };

            // Act
            var projectIssue = await _issueService.CreateProjectIssueAsync(createIssueDto);

            // Assert
            Assert.NotNull(projectIssue);
            Assert.Equal("Test Project Issue", projectIssue.Title);
            Assert.Equal("Test Project Issue Description", projectIssue.Description);
            Assert.True(projectIssue.Public);

            var actualUserIds = projectIssue.ProjectIssueUsers.Select(pu => pu.UserId.ToString()).ToList();
            var expectedUserIds = new List<string>() { userIdString };
            Assert.Equal(expectedUserIds, actualUserIds);
        }

        [Fact]
        public async Task CreateWorkIssueAsync_ShouldCreateWorkIssue()
        {
            // Arrange
            var userId = Guid.NewGuid();
            SetupDatabaseValidationMock(userId);
            SeedUserData(userId);
            var userIdString = userId.ToString();

            var createIssueDto = new CreateIssueDto
            {
                IssueObjectType = "Work",
                WorkId = 1,
                WorkType = "Paper",
                Title = "Test Work Issue",
                Description = "Test Work Issue Description",
                Users = new List<string>()
                {
                    userIdString
                },
                Public = true
            };

            // Act
            var workIssue = await _issueService.CreateWorkIssueAsync(createIssueDto);

            // Assert
            Assert.NotNull(workIssue);
            Assert.Equal("Test Work Issue", workIssue.Title);
            Assert.Equal("Test Work Issue Description", workIssue.Description);
            Assert.True(workIssue.Public);

            var actualUserIds = workIssue.WorkIssueUsers.Select(pu => pu.UserId.ToString()).ToList();
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
