using System.Reflection;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Data;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Features.Works.Models.WorkUsers;
using sciencehub_backend.Features.Works.Services;
using sciencehub_backend.Shared.Enums;
using sciencehub_backend.Shared.Validation;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Services
{
    public class WorkSubmissionChangeService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<WorkSubmissionChangeService> _logger;
        private readonly TextDiffManager _textDiffManager;
        private readonly DatabaseValidation _databaseValidation;
        private readonly WorkUtilsService _workUtilsService;

        public WorkSubmissionChangeService(AppDbContext context, ILogger<WorkSubmissionChangeService> logger)
        {
            _context = context;
            _logger = logger;
            _textDiffManager = new TextDiffManager();
            _databaseValidation = new DatabaseValidation(_context);
            _workUtilsService = new WorkUtilsService(_context);
        }

        public async Task<WorkSubmission> AcceptWorkSubmissionAsync(int workSubmissionId, string currentUserIdString, bool? bypassPermissions = false, IDbContextTransaction? transaction = null)
        {
            var currentTransaction = transaction ?? await _context.Database.BeginTransactionAsync();

            try
            {
                // Fetch work submission
                var workSubmission = await _context.WorkSubmissions
                    .Include(ws => ws.ProjectWorkSubmissions)
                    .SingleOrDefaultAsync(ws => ws.Id == workSubmissionId);

                if (workSubmission == null)
                {
                    throw new InvalidSubmissionIdException();
                }

                // Fetch work
                var (work, workUsers) = await _workUtilsService.GetWorkAsync(workSubmission.WorkId, workSubmission.WorkType);

                // Permissions
                await ProcessPermissionsAsync(currentUserIdString, workSubmission, work, workUsers, bypassPermissions ?? false);

                // Trigger lazy loading
                var workMetadata = work.WorkMetadata;
                var workDelta = workSubmission.WorkDelta;

                // Apply text diffs and text arrays to work properties
                ApplyTextDiffsToWork(work, workSubmission.WorkDelta);
                ApplyTextArraysToWork(work, workSubmission.WorkDelta);

                // Update file location if necessary
                var fileLocation = workSubmission.FileChanges.fileToBeAdded ?? workSubmission.FileChanges.fileToBeUpdated;
                if (fileLocation != null)
                {
                    work.FileLocation = fileLocation;
                }

                // Update current version id
                work.CurrentWorkVersionId = workSubmission.FinalWorkVersionId;

                // Save updated work
                await _context.SaveChangesAsync();


                // Update submission with status and Accepted data
                await UpdateSubmissionAsync(workSubmission, workUsers, currentUserIdString);

                // Commit transaction, only if function is used independently (not as part of a larger transaction)
                if (transaction == null)
                {
                    currentTransaction.Commit();
                }

                // TODO: Decide based on size whether initial version id is snapshot and update project graph accordingly
                // TODO: Delete an old bucket file if necessary
                // In the future, keep old file once enough storage is secured
                // TODO: Add work submission users to work users as "Contributor" if not already present

                return workSubmission;
            }
            catch (Exception ex)
            {
                if (transaction == null)
                {
                    currentTransaction.Rollback();
                }
                _logger.LogError($"Error accepting submission: {ex.Message}");
                throw;
            }
        }

        // Permissions to accept submission
        private async Task ProcessPermissionsAsync(string currentUserIdString, WorkSubmission workSubmission, WorkBase work, IEnumerable<WorkUserDto> workUsers, bool bypassPermissions)
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
            -current user is main author
            -current submission status is Submitted
            -current version id is the same as the initial version id of the submission
            */
            var currentUserId = await _databaseValidation.ValidateUserId(currentUserIdString);

            bool isAttachedToProjectSubmission = workSubmission?.ProjectWorkSubmissions?.Any() ?? false;
            if (isAttachedToProjectSubmission)
            {
                throw new Exception("The submission cannot be accepted as it is attached to a project submission.");
            }

            var isWorkMainAuthor = workUsers.Any(u => u.UserId == currentUserId && u.Role == "Main Author");
            if (!isWorkMainAuthor)
            {
                throw new Exception("Not authorized to accept the submission");
            }

            var isWrongStatus1 = workSubmission.Status == SubmissionStatus.InProgress;
            if (isWrongStatus1)
            {
                throw new Exception("The submission cannot be accepted as it has not been submitted yet.");
            }
            var isWrongStatus2 = workSubmission.Status == SubmissionStatus.Accepted;
            if (isWrongStatus2)
            {
                throw new Exception("The submission has already been accepted.");
            }

            // TODO: Remove this constraint in the future with merging
            var isCorrectVersion = workSubmission.InitialWorkVersionId == work.CurrentWorkVersionId;
            if (!isCorrectVersion)
            {
                throw new Exception("The work has been updated since the submission was made.");
            }
        }

        // General function applying delta diffs to an object's properties
        private void ApplyDiffsToObjectProperties(object targetObject, WorkDelta delta, string[] fieldNames)
        {
            foreach (string fieldName in fieldNames)
            {
                PropertyInfo targetProperty = targetObject.GetType().GetProperty(fieldName);
                PropertyInfo diffProperty = typeof(WorkDelta).GetProperty(fieldName);

                if (targetProperty != null && diffProperty != null)
                {
                    var diff = (DiffInfo)diffProperty.GetValue(delta);
                    if (diff != null && diff.TextDiffs != null)
                    {
                        // Apply text diffs to string properties
                        string originalValue = (string)targetProperty.GetValue(targetObject) ?? "";
                        string updatedValue = _textDiffManager.ApplyTextDiffs(originalValue, diff.TextDiffs);
                        targetProperty.SetValue(targetObject, updatedValue);
                    }
                }
            }
        }

        private void ApplyTextArraysToObjectProperties(object targetObject, WorkDelta delta, string[] fieldNames)
        {
            foreach (string fieldName in fieldNames)
            {
                PropertyInfo targetProperty = targetObject.GetType().GetProperty(fieldName);
                PropertyInfo diffProperty = typeof(WorkDelta).GetProperty(fieldName);

                if (targetProperty != null && diffProperty != null)
                {
                    var diff = (DiffInfo)diffProperty.GetValue(delta);
                    if (diff != null && diff.TextArrays != null)
                    {
                        // Just replace old values for text array properties
                        string[] updatedValue = diff.TextArrays.ToArray();
                        targetProperty.SetValue(targetObject, updatedValue);
                    }
                }
            }
        }

        // Apply all necessary text diffs to a work
        private void ApplyTextDiffsToWork(WorkBase work, WorkDelta delta)
        {
            string[] workBaseFields = { "Title", "Description" };
            ApplyDiffsToObjectProperties(work, delta, workBaseFields);

            string[] metadataVersionedFields = { "License", "Publisher", "Conference" };
            ApplyDiffsToObjectProperties(work.WorkMetadata, delta, metadataVersionedFields);

            ApplyDiffsToSpecificProperties(work, delta);

            // Set WorkMetadata again to update cache and JSON
            work.WorkMetadata = work.WorkMetadata;
        }

        private void ApplyTextArraysToWork(WorkBase work, WorkDelta delta)
        {
            string[] workBaseFields = { /* To be expanded in the future */};
            ApplyTextArraysToObjectProperties(work, delta, workBaseFields);

            string[] metadataVersionedFields = { "Tags", "Keywords" };
            ApplyTextArraysToObjectProperties(work.WorkMetadata, delta, metadataVersionedFields);

            // Set WorkMetadata again to update cache and JSON
            work.WorkMetadata = work.WorkMetadata;
        }

        // Properties specific to a derived class of WorkBase
        private void ApplyDiffsToSpecificProperties(WorkBase work, WorkDelta delta)
        {
            if (work is Paper paper)
            {
                string[] paperSpecificFields = { "Abstract" };
                ApplyDiffsToObjectProperties(paper, delta, paperSpecificFields);
            }
            if (work is Experiment experiment)
            {
                string[] experimentSpecificFields = { "Objective" };
                ApplyDiffsToObjectProperties(experiment, delta, experimentSpecificFields);
            }
            // Add other in the future
        }
        
        private async Task UpdateSubmissionAsync(WorkSubmission workSubmission, IEnumerable<WorkUserDto> workUsers, string currentUserIdString)
        {
            // Update submission status
            workSubmission.Status = SubmissionStatus.Accepted;

            // Record user and date of acceptance 
            AcceptedData acceptedData = new AcceptedData
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
            workSubmission.AcceptedData = acceptedData;
            await _context.SaveChangesAsync();
        }
    }
};