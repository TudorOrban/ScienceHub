using System.Reflection;
using sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend_core.Features.Works.Models;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Services
{
    public class DiffManager : IDiffManager
    {
        private readonly ITextDiffManager _textDiffManager;

        public DiffManager(ITextDiffManager textDiffManager)
        {
            _textDiffManager = textDiffManager;
        }
        
        // Apply all necessary text diffs to a work
        public void ApplyTextDiffsToWork(WorkBase work, WorkDelta delta)
        {
            string[] workBaseFields = { "Title", "Description" };
            ApplyDiffsToObjectProperties(work, delta, workBaseFields);

            string[] metadataVersionedFields = { "License", "Publisher", "Conference" };
            ApplyDiffsToObjectProperties(work.WorkMetadata, delta, metadataVersionedFields);

            ApplyDiffsToSpecificProperties(work, delta);

            // Set WorkMetadata again to update cache and JSON
            work.WorkMetadata = work.WorkMetadata;
        }

        public void ApplyTextArraysToWork(WorkBase work, WorkDelta delta)
        {
            string[] workBaseFields = { /* To be expanded in the future */};
            ApplyTextArraysToObjectProperties(work, delta, workBaseFields);

            string[] metadataVersionedFields = { "Tags", "Keywords" };
            ApplyTextArraysToObjectProperties(work.WorkMetadata, delta, metadataVersionedFields);

            // Set WorkMetadata again to update cache and JSON
            work.WorkMetadata = work.WorkMetadata;
        }

        // Properties specific to a derived class of WorkBase
        public void ApplyDiffsToSpecificProperties(WorkBase work, WorkDelta delta)
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
    }
}