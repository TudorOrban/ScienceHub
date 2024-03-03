using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Moq;

using sciencehub_backend.Data;
using sciencehub_backend.Features.Projects.Dto;
using sciencehub_backend.Features.Projects.Services;
using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Shared.Sanitation;
using sciencehub_backend.Shared.Validation;

namespace sciencehub_backend.Tests.Features.Projects.Services
{
    public class ProjectServiceTests
    {
        private readonly AppDbContext _context;
        private readonly IProjectService _projectService;
        private readonly Mock<ISanitizerService> _sanitizerServiceMock;
        private readonly Mock<IDatabaseValidation> _databaseValidationMock;
        private readonly Mock<ILogger<ProjectService>> _projectServiceLoggerMock;

        public ProjectServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb_Project")
                .ConfigureWarnings(warnings =>
                    warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning)) // Ignore the transaction warning for in-memory database
                .Options;

            _context = new AppDbContext(options);

            _sanitizerServiceMock = new Mock<ISanitizerService>();
            _databaseValidationMock = new Mock<IDatabaseValidation>();
            _projectServiceLoggerMock = new Mock<ILogger<ProjectService>>();

            // Setup
            _sanitizerServiceMock.Setup(s => s.Sanitize(It.IsAny<string>())).Returns<string>(input => input);
            _databaseValidationMock.Setup(m => m.ValidateUserId(It.IsAny<string>()))
                .ReturnsAsync(Guid.Parse("e0d141e9-5ba4-457f-9f53-10a52aca7810"));

            // Construct service
            _projectService = new ProjectService(_context, _projectServiceLoggerMock.Object, _sanitizerServiceMock.Object, _databaseValidationMock.Object);
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
            var project = await _projectService.CreateProjectAsync(createProjectDto);

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

            // Project version and versions graph
            // Act
            var initialProjectVersion = await _context.ProjectVersions
                .FirstOrDefaultAsync(pv => pv.ProjectId == project.Id);

            // Assert - not null and project's current version ID updated correctly
            Assert.NotNull(initialProjectVersion);
            Assert.Equal(initialProjectVersion.Id, project.CurrentProjectVersionId);

            // Act
            var projectGraph = await _context.ProjectGraphs
                .FirstOrDefaultAsync(pvg => pvg.ProjectId == project.Id);

            // Assert
            Assert.NotNull(projectGraph);

            // Assert - GraphDataParsed contains the initial project version ID as a key
            Assert.True(projectGraph.GraphData.ContainsKey(initialProjectVersion.Id.ToString()));

            var graphNode = projectGraph.GraphData[initialProjectVersion.Id.ToString()];

            // Assert - GraphNode properties are set correctly
            Assert.NotNull(graphNode);
            Assert.Empty(graphNode.Neighbors);
            Assert.True(graphNode.IsSnapshot);
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

            // Set up the mock to throw an InvalidUserIdException for the invalid user ID
            _databaseValidationMock.Setup(m => m.ValidateUserId(It.Is<string>(id => id == invalidUserId.ToString())))
                .ThrowsAsync(new InvalidUserIdException());

            // Act & Assert
            await Assert.ThrowsAsync<InvalidUserIdException>(() =>
                _projectService.CreateProjectAsync(createProjectDto));
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
    }
}
