using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Core.Users.DTOs;
using sciencehub_backend_core.Core.Users.Models;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Projects.Models;
using sciencehub_backend_core.Features.Submissions.Models;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Validation;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Services
{
    public class ProjectSubmissionSubmitService : IProjectSubmissionSubmitService
    {
         private readonly CoreServiceDbContext _context;
        private readonly ILogger<ProjectSubmissionSubmitService> _logger;
        private readonly IDatabaseValidation _databaseValidation;
        private readonly IWorkSubmissionSubmitService _workSubmissionSubmitService;

        public ProjectSubmissionSubmitService(CoreServiceDbContext context, ILogger<ProjectSubmissionSubmitService> logger, IWorkSubmissionSubmitService workSubmissionSubmitService, IDatabaseValidation databaseValidation)
        {
            _context = context;
            _logger = logger;
            _workSubmissionSubmitService = workSubmissionSubmitService;
            _databaseValidation = databaseValidation;
        }

        public async Task<ProjectSubmission> SubmitProjectSubmissionAsync(int projectSubmissionId, string currentUserIdString)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Fetch project submission
                var projectSubmission = await _context.ProjectSubmissions
                    .Include(ps => ps.ProjectWorkSubmissions)
                    .Include(ps => ps.ProjectSubmissionUsers)
                    .SingleOrDefaultAsync(ps => ps.Id == projectSubmissionId);

                if (projectSubmission == null)
                {
                    throw new InvalidSubmissionIdException();
                }

                // Fetch project and users
                var project = await _context.Projects.Include(p => p.ProjectUsers).ThenInclude(pu => pu.User).SingleOrDefaultAsync(p => p.Id == projectSubmission.ProjectId);
                if (project == null)
                {
                    throw new InvalidProjectIdException();
                }
                var projectUsers = project.ProjectUsers.Select(pu => new WorkUserDTO
                {
                    UserId = pu.UserId,
                    Role = pu.Role,
                    Username = pu.User.Username,
                    FullName = pu.User.FullName
                }).ToList();

                // Permissions
                await ProcessPermissionsAsync(currentUserIdString, projectSubmission, project, projectUsers);

                // Update submission with status and Accepted data
                await UpdateSubmissionAsync(projectSubmission, projectUsers, currentUserIdString);

                // Apply changes from all of the project's work submissions
                foreach (var workSubmission in projectSubmission.ProjectWorkSubmissions)
                {
                    await _workSubmissionSubmitService.SubmitWorkSubmissionAsync(workSubmission.WorkSubmissionId, currentUserIdString, true, transaction);
                }

                // Commit transaction
                transaction.Commit();

                return projectSubmission;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError($"Error submitting project submission: {ex.Message}");
                throw;
            }
        }

        // Permissions to accept submission
        private async Task ProcessPermissionsAsync(string currentUserIdString, ProjectSubmission projectSubmission, Project project, IEnumerable<WorkUserDTO> projectUsers)
        {
            /* 
            Permissions: 
            -valid current user id,  
            -current user is main author
            -current submission status is Submitted
            -current version id is the same as the initial version id of the submission
            */
            var currentUserId = await _databaseValidation.ValidateUserId(currentUserIdString);

            var isSubmissionAuthor = projectSubmission.ProjectSubmissionUsers.Any(u => u.UserId == currentUserId);
            if (!isSubmissionAuthor)
            {
                throw new Exception("Not authorized to submit the submission");
            }

            var isWrongStatus1 = projectSubmission.Status == SubmissionStatus.Submitted;
            if (isWrongStatus1)
            {
                throw new Exception("The submission has already been submitted.");
            }
            var isWrongStatus2 = projectSubmission.Status == SubmissionStatus.Accepted;
            if (isWrongStatus2)
            {
                throw new Exception("The submission has already been accepted.");
            }

            // TODO: Remove this constraint in the future with merging
            var isCorrectVersion = projectSubmission.InitialProjectVersionId == project.CurrentProjectVersionId;
            if (!isCorrectVersion)
            {
                throw new Exception("The project has been updated since the submission was made.");
            }
        }

        private async Task UpdateSubmissionAsync(ProjectSubmission projectSubmission, IEnumerable<WorkUserDTO> projectUsers, string currentUserIdString)
        {
            // Update submission status
            projectSubmission.Status = SubmissionStatus.Submitted;

            // Record user and date of acceptance 
            SubmittedData submittedData = new SubmittedData
            {
                Date = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssK"),
                Users = projectUsers
                        .Where(wu => wu.UserId.ToString() == currentUserIdString)
                        .Select(wu => new SmallUser
                        {
                            Id = wu.UserId.ToString(),
                            Username = wu.Username,
                            FullName = wu.FullName
                        }).ToArray()
            };
            projectSubmission.SubmittedData = submittedData;
            await _context.SaveChangesAsync();
        }
    }
}