using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using sciencehub_backend_core.Core.Users.Models;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Submissions.Models;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend_core.Features.Works.Models;
using sciencehub_backend_core.Features.Works.Services;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Validation;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Services
{
    public class WorkSubmissionSubmitService : IWorkSubmissionSubmitService
    {
        private readonly CoreServiceDbContext _context;
        private readonly ILogger<WorkSubmissionSubmitService> _logger;
        private readonly IWorkUtilsService _workUtilsService;
        private readonly IDatabaseValidation _databaseValidation;

        public WorkSubmissionSubmitService(CoreServiceDbContext context, ILogger<WorkSubmissionSubmitService> logger, IWorkUtilsService workUtilsService, IDatabaseValidation databaseValidation)
        {
            _context = context;
            _logger = logger;
            _workUtilsService = workUtilsService;
            _databaseValidation = databaseValidation;
        }
        
        public async Task<WorkSubmission> SubmitWorkSubmissionAsync(int workSubmissionId, string currentUserIdString, bool? bypassPermissions = false, IDbContextTransaction? transaction = null)
        {
            // Start transaction if not already started by SubmitProjectSubmissionAsync
            var currentTransaction = transaction ?? await _context.Database.BeginTransactionAsync();

            try {
                // Fetch work submission
                var workSubmission = await _context.WorkSubmissions
                    .Include(ws => ws.ProjectWorkSubmissions)
                    .Include(ws => ws.WorkSubmissionUsers)
                    .SingleOrDefaultAsync(ws => ws.Id == workSubmissionId);

                if (workSubmission == null)
                {
                    throw new InvalidSubmissionIdException();
                }

                // Fetch work
                var (work, workUsers) = await _workUtilsService.GetWorkAsync(workSubmission.WorkId, workSubmission.WorkType);

                // Permissions
                await ProcessWorkPermissionsAsync(currentUserIdString, workSubmission, work, bypassPermissions ?? false);

                // Update submission status
                workSubmission.Status = SubmissionStatus.Submitted;

                // Record user and date of submit 
                SubmittedData submittedData = new SubmittedData
                {
                    Date = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssK"),
                    Users = workUsers
                            .Where(wu => wu.UserId.ToString() == currentUserIdString)
                            .Select(wu => new SmallUser
                            {
                                Id = wu.UserId.ToString(),
                                Username = wu.Username,
                                FullName = wu.FullName
                            }).ToArray()
                };
                workSubmission.SubmittedData = submittedData;
                await _context.SaveChangesAsync();

                // Commit transaction, only if function is used independently (not as part of the larger transaction AcceptProjectSubmissionAsync)
                if (transaction == null)
                {
                    currentTransaction.Commit();
                }
                
                return workSubmission;
            }
            catch (Exception ex)
            {
                if (transaction == null)
                {
                    currentTransaction.Rollback();
                }
                _logger.LogError(ex, "Error submitting work submission.");
                throw;
            }
        }

        private async Task ProcessWorkPermissionsAsync(string currentUserIdString, WorkSubmission workSubmission, WorkBase work, bool bypassPermissions) 
        {
            // Skip permission checks if bypassPermissions
            if (bypassPermissions)
            {
                return;
            }

            /* 
            Permissions: 
            -valid current id, 
            -work submission not belong to a project submission, 
            -current user is submission user
            -current submission status is In progress
            -current version id is the same as the initial version id of the submission
            */
            var currentUserId = await _databaseValidation.ValidateUserId(currentUserIdString);

            bool isAttachedToProjectSubmission = workSubmission?.ProjectWorkSubmissions?.Any() ?? false;
            if (isAttachedToProjectSubmission)
            {
                throw new Exception("The submission cannot be submitted as it is attached to a project submission.");
            }

            var isSubmissionAuthor = workSubmission?.WorkSubmissionUsers?.Any(u => u.UserId == currentUserId);
            if (isSubmissionAuthor == null || !isSubmissionAuthor.Value)
            {
                throw new Exception("Not authorized to submit the submission");
            }

            var isWrongStatus1 = workSubmission?.Status == SubmissionStatus.Submitted;
            if (isWrongStatus1)
            {
                throw new Exception("The submission has already been submitted.");
            }
            var isWrongStatus2 = workSubmission?.Status == SubmissionStatus.Accepted;
            if (isWrongStatus2)
            {
                throw new Exception("The submission has already been accepted.");
            }
        }
    }
}