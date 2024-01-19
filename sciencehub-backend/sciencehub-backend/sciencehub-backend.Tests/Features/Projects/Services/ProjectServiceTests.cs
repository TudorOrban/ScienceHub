using Microsoft.EntityFrameworkCore;
using Xunit;
using Moq;
using sciencehub_backend.Data;
using sciencehub_backend.Features.Projects.Dto;
using sciencehub_backend.Features.Projects.Services;
using Microsoft.EntityFrameworkCore.Diagnostics;
using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Exceptions.Errors;

namespace sciencehub_backend.sciencehub_backend.Tests.Features.Projects.Services
{
    public class ProjectServiceTests
    {
        private readonly AppDbContext _context;
        private readonly ProjectService _projectService;
        private readonly SanitizerService _sanitizerService;

        public ProjectServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb")
                .ConfigureWarnings(warnings =>
                    warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning)) // Ignore the transaction warning for in-memory database
                .Options;

            _context = new AppDbContext(options);
            var loggerMock = new Mock<ILogger<SanitizerService>>();
            _sanitizerService = new SanitizerService(loggerMock.Object);
            _projectService = new ProjectService(_context);
        }

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

        [Fact]
        public async Task CreateProjectAsync_ShouldCreateProject()
        {
            
            // Arrange
            SeedUserData(Guid.Parse("e0d141e9-5ba4-457f-9f53-10a52aca7810"));

            var createProjectDto = new CreateProjectDto
            {
                Name = "Test Project",
                Title = "Test Project Title",
                Description = "Test Description",
                Link = "http://example.com",
                Public = true,
                Users = new List<string>()
                {
                    "e0d141e9-5ba4-457f-9f53-10a52aca7810",
                }
            };

            // Act
            var project = await _projectService.CreateProjectAsync(createProjectDto, _sanitizerService);

            // Assert
            Assert.NotNull(project);
            Assert.Equal("Test Project", project.Name);
            Assert.Equal("Test Project Title", project.Title);
            Assert.Equal("Test Description", project.Description);
            Assert.Equal("http://example.com", project.Link);
            Assert.Equal(true, project.Public);

            var actualUserIds = project.ProjectUsers.Select(pu => pu.UserId.ToString()).ToList();
            var expectedUserIds = new List<string>() { "e0d141e9-5ba4-457f-9f53-10a52aca7810" };
            Assert.Equal(expectedUserIds, actualUserIds);

            // Act
            var projectVersion = await _context.ProjectVersions
                .FirstOrDefaultAsync(pv => pv.ProjectId == project.Id);
            Assert.NotNull(projectVersion);

            // Assert - project's current version ID set correctly
            Assert.Equal(projectVersion.Id, project.CurrentProjectVersionId);

        }

        [Fact]
        public async Task CreateProjectAsync_ShouldThrowInvalidUserIdException()
        {
            // Arrange
            var invalidUserId = Guid.NewGuid();
            var createProjectDto = new CreateProjectDto
            {
                Name = "Test Project",
                Title = "Test Project Title",
                Description = "Test Description",
                Link = "http://example.com",
                Public = true,
                Users = new List<string>()
                {
                    invalidUserId.ToString()
                }
            };

            // Act & Assert
            await Assert.ThrowsAsync<InvalidUserIdException>(() =>
                _projectService.CreateProjectAsync(createProjectDto, _sanitizerService));
        }
    }
}
