using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Moq;
using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Data;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Services;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Services;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Features.Works.Services;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Validation;

namespace sciencehub_backend.Tests.Features.Submissions.VersionControlSystem.Services
{
    public class WorkSubmissionAcceptServiceTests
    {
        private readonly AppDbContext _context;
        private readonly IWorkSubmissionAcceptService _acceptService;
        private readonly Mock<ILogger<WorkSubmissionAcceptService>> _loggerMock;
        private readonly Mock<ISnapshotService> _snapshotServiceMock;
        private readonly Mock<IDiffManager> _diffManagerMock;
        private readonly Mock<IDatabaseValidation> _databaseValidationMock;
        private readonly Mock<IWorkUtilsService> _workUtilsServiceMock;

        public WorkSubmissionAcceptServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb")
                .ConfigureWarnings(warnings =>
                    warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
                .Options;

            _context = new AppDbContext(options);
            _loggerMock = new Mock<ILogger<WorkSubmissionAcceptService>>();
            _snapshotServiceMock = new Mock<ISnapshotService>();
            _diffManagerMock = new Mock<IDiffManager>();
            _workUtilsServiceMock = new Mock<IWorkUtilsService>();
            _databaseValidationMock = new Mock<IDatabaseValidation>();

            // Setup
            _databaseValidationMock.Setup(m => m.ValidateUserId(It.IsAny<string>()))
                .ReturnsAsync(Guid.NewGuid());


            _acceptService = new WorkSubmissionAcceptService(_context, _snapshotServiceMock.Object, _loggerMock.Object, _diffManagerMock.Object, _workUtilsServiceMock.Object, _databaseValidationMock.Object);
        }

        [Fact]
        public async Task AcceptWorkSubmissionAsync_SuccessfulAcceptance_UpdatesAndSaves()
        {
            // Arrange
            var workSubmissionId = 1;
            var currentUserIdString = "794f5523-2fa2-4e22-9f2f-8234ac15829a";
            var workSubmission = CreateMockWorkSubmission(workSubmissionId);
            var work = CreateMockWork();
            var workUsers = CreateMockWorkUsers();

            _context.WorkSubmissions.Add(workSubmission);
            await _context.SaveChangesAsync();

            _workUtilsServiceMock.Setup(s => s.GetWorkAsync(It.IsAny<int>(), It.IsAny<WorkType>()))
                .ReturnsAsync((work, workUsers));

            // Act
            var result = await _acceptService.AcceptWorkSubmissionAsync(workSubmissionId, currentUserIdString, false);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(SubmissionStatus.Accepted, result.Status);
            Assert.NotNull(result.AcceptedData);
            Assert.Equal(currentUserIdString, result.AcceptedData.Users[0].Id);
            Assert.Equal(work.CurrentWorkVersionId, 2);
        }



        private WorkSubmission CreateMockWorkSubmission(int id)
        {
            WorkSubmission workSubmission = new WorkSubmission
            {
                Id = 1,
                WorkType = WorkType.Paper,
                WorkId = 1,
                InitialWorkVersionId = 1,
                FinalWorkVersionId = 2,
                Status = SubmissionStatus.Submitted,
                Title = "Initial work submission",
                WorkDeltaJson = @"{
                    ""conference"": {
                        ""type"": ""TextDiff"",
                        ""textDiffs"": [
                        {
                            ""insert"": ""IPS "",
                            ""position"": 7,
                            ""deleteCount"": 6
                        }
                        ],
                        ""lastChangeDate"": ""2023-12-22 21:07:50+00"",
                        ""lastChangeUser"": {
                        ""id"": ""794f5523-2fa2-4e22-9f2f-8234ac15829a"",
                        ""fullName"": ""Tudor A. Orban"",
                        ""username"": ""TudorAOrban1""
                        }
                    },
                    ""description"": {
                        ""type"": ""TextDiff"",
                        ""textDiffs"": [
                        {
                            ""insert"": ""Lets test the functionality"",
                            ""position"": 0,
                            ""deleteCount"": 0
                        }
                        ],
                        ""lastChangeDate"": ""2023-12-22 21:07:45+00"",
                        ""lastChangeUser"": {
                        ""id"": ""794f5523-2fa2-4e22-9f2f-8234ac15829a"",
                        ""fullName"": ""Tudor A. Orban"",
                        ""username"": ""TudorAOrban1""
                        }
                    }
                    }",
                FileChangesJson = @"{}",
            };

            return workSubmission;
        }

        private WorkBase CreateMockWork()
        {
            WorkBase workBase = new WorkBase
            {
                Id = 1,
                WorkType = WorkType.Paper,
                Title = "Initial work version title",
                Description = "Initial work version description",
                WorkMetadataJson = @"{
                    ""conference"": ""Random Conference"",
                    ""license"": ""MIT Apache 2""
                    }",
                CurrentWorkVersionId = 1,
            };

            return workBase;
        }

        private IEnumerable<WorkUserDto> CreateMockWorkUsers()
        {
            List<WorkUserDto> workUsers = new List<WorkUserDto>
            {
                new WorkUserDto
                {
                    UserId = Guid.Parse("794f5523-2fa2-4e22-9f2f-8234ac15829a"),
                    FullName = "Tudor A. Orban",
                    Username = "TudorAOrban1",
                    Role = "Main Author"
                }
            };

            return workUsers;
        }


    }
}
