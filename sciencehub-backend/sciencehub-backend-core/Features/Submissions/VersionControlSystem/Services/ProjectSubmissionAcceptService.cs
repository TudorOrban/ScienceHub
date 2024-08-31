using System.Reflection;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Core.Users.Models;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Projects.Models;
using sciencehub_backend_core.Features.Submissions.Models;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Reconstruction.Services;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Validation;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Services
{
    public class ProjectSubmissionAcceptService : IProjectSubmissionAcceptService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProjectSubmissionAcceptService> _logger;
        private readonly ITextDiffManager _textDiffManager;
        private readonly IDatabaseValidation _databaseValidation;
        private readonly IWorkSubmissionAcceptService _workSubmissionAcceptService;
        private readonly ISnapshotService _snapshotService;

        public ProjectSubmissionAcceptService(AppDbContext context, ILogger<ProjectSubmissionAcceptService> logger, IWorkSubmissionAcceptService workSubmissionAcceptService, ITextDiffManager textDiffManager, ISnapshotService snapshotService, IDatabaseValidation databaseValidation)
        {
            _context = context;
            _logger = logger;
            _textDiffManager = textDiffManager;
            _workSubmissionAcceptService = workSubmissionAcceptService;
            _snapshotService = snapshotService;
            _databaseValidation = databaseValidation;
        }

        public async Task<ProjectSubmission> AcceptProjectSubmissionAsync(int projectSubmissionId, string currentUserIdString)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Fetch project submission
                var projectSubmission = await _context.ProjectSubmissions
                    .Include(ps => ps.ProjectWorkSubmissions)
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
                var projectUsers = project.ProjectUsers.Select(pu => new WorkUserDto
                {
                    UserId = pu.UserId,
                    Role = pu.Role,
                    Username = pu.User.Username,
                    FullName = pu.User.FullName
                }).ToList();

                // Permissions
                await ProcessPermissionsAsync(currentUserIdString, projectSubmission, project, projectUsers);

                // Trigger lazy loading
                var projectMetadata = project.ProjectMetadata;
                var projectDelta = projectSubmission.ProjectDelta;

                // Apply text diffs and text arrays to project properties
                ApplyTextDiffsToProject(project, projectSubmission.ProjectDelta);
                ApplyTextArraysToProject(project, projectSubmission.ProjectDelta);

                // Update current version id
                project.CurrentProjectVersionId = projectSubmission.FinalProjectVersionId;

                // Save updated project
                await _context.SaveChangesAsync();

                // Update submission with status and Accepted data
                await UpdateSubmissionAsync(projectSubmission, projectUsers, currentUserIdString);

                // Apply changes from all of the project's work submissions
                foreach (var workSubmission in projectSubmission.ProjectWorkSubmissions)
                {
                    await _workSubmissionAcceptService.AcceptWorkSubmissionAsync(workSubmission.WorkSubmissionId, currentUserIdString, true, transaction);
                }
                
                // Manage older versions
                await _snapshotService.ProcessProjectSnapshot(project, projectSubmission);

                // Commit transaction
                transaction.Commit();

                // TODO: Decide based on size whether initial version id is snapshot and update project graph accordingly
                // TODO: Delete an old bucket file if necessary
                // In the future, keep old file once enough storage is secured

                return projectSubmission;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                _logger.LogError($"Error accepting submission: {ex.Message}");
                throw;
            }
        }

        // Permissions to accept submission
        private async Task ProcessPermissionsAsync(string currentUserIdString, ProjectSubmission projectSubmission, Project project, IEnumerable<WorkUserDto> projectUsers)
        {
            /* 
            Permissions: 
            -valid current user id,  
            -current user is main author
            -current submission status is Submitted
            -current version id is the same as the initial version id of the submission
            */
            var currentUserId = await _databaseValidation.ValidateUserId(currentUserIdString);

            var isProjectMainAuthor = projectUsers.Any(u => u.UserId == currentUserId && u.Role == "Main Author");
            if (!isProjectMainAuthor)
            {
                throw new Exception("Not authorized to accept the submission");
            }

            var isWrongStatus1 = projectSubmission.Status == SubmissionStatus.InProgress;
            if (isWrongStatus1)
            {
                throw new Exception("The submission cannot be accepted as it has not been submitted yet.");
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

        // General function applying delta diffs to an object's properties
        private void ApplyDiffsToObjectProperties(object targetObject, ProjectDelta delta, string[] fieldNames)
        {
            foreach (string fieldName in fieldNames)
            {
                PropertyInfo targetProperty = targetObject.GetType().GetProperty(fieldName);
                PropertyInfo diffProperty = typeof(ProjectDelta).GetProperty(fieldName);

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

        private void ApplyTextArraysToObjectProperties(object targetObject, ProjectDelta delta, string[] fieldNames)
        {
            foreach (string fieldName in fieldNames)
            {
                PropertyInfo targetProperty = targetObject.GetType().GetProperty(fieldName);
                PropertyInfo diffProperty = typeof(ProjectDelta).GetProperty(fieldName);

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

        // Apply all necessary text diffs to a project
        private void ApplyTextDiffsToProject(Project project, ProjectDelta? delta)
        {
            if (delta == null) return;
            
            string[] projectBaseFields = { "Title", "Description" };
            ApplyDiffsToObjectProperties(project, delta, projectBaseFields);

            string[] metadataVersionedFields = { "License", "Publisher", "Conference" };
            ApplyDiffsToObjectProperties(project.ProjectMetadata, delta, metadataVersionedFields);

            // Set ProjectMetadata again to update cache and JSON
            project.ProjectMetadata = project.ProjectMetadata;
        }

        private void ApplyTextArraysToProject(Project project, ProjectDelta? delta)
        {
            if (delta == null) return;

            string[] projectBaseFields = { /* To be expanded in the future */};
            ApplyTextArraysToObjectProperties(project, delta, projectBaseFields);

            string[] metadataVersionedFields = { "Tags", "Keywords" };
            ApplyTextArraysToObjectProperties(project.ProjectMetadata, delta, metadataVersionedFields);

            // Set ProjectMetadata again to update cache and JSON
            project.ProjectMetadata = project.ProjectMetadata;
        }

        private async Task UpdateSubmissionAsync(ProjectSubmission projectSubmission, IEnumerable<WorkUserDto> projectUsers, string currentUserIdString)
        {
            // Update submission status
            projectSubmission.Status = SubmissionStatus.Accepted;

            // Record user and date of acceptance 
            AcceptedData acceptedData = new AcceptedData
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
            projectSubmission.AcceptedData = acceptedData;
            await _context.SaveChangesAsync();
        }
    }
};