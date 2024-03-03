
using DiffPlex;
using DiffPlex.DiffBuilder;
using DiffPlex.DiffBuilder.Model;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Services;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Models
{
    public class TextDiffManager : ITextDiffManager
    {
        private readonly IDiffer differ;
        private readonly IInlineDiffBuilder diffBuilder;

        public TextDiffManager()
        {
            differ = new Differ();
            diffBuilder = new InlineDiffBuilder(differ);
        }

        public List<TextDiff> CalculateDiffs(string initialText, string newText)
        {
            var diffResult = diffBuilder.BuildDiffModel(initialText, newText);
            return FormatDiffs(diffResult);
        }

        public List<TextDiff> FormatDiffs(DiffPaneModel diffResult)
        {
            var diffs = new List<TextDiff>();
            int position = 0;

            foreach (var line in diffResult.Lines)
            {
                if (line.Type == ChangeType.Inserted)
                {
                    diffs.Add(new TextDiff { Position = position, DeleteCount = 0, Insert = line.Text });
                }
                else if (line.Type == ChangeType.Deleted)
                {
                    diffs.Add(new TextDiff { Position = position, DeleteCount = line.Text.Length, Insert = "" });
                    position += line.Text.Length;
                }
                else
                {
                    position += line.Text.Length;
                }
            }

            return diffs;
        }

        public string ApplyTextDiffs(string original, List<TextDiff> diffs)
        {
            var originalArray = new List<char>(original);
            int operationOffset = 0;

            foreach (var diff in diffs)
            {
                int adjustedPosition = diff.Position + operationOffset;

                // Perform deletion
                if (diff.DeleteCount > 0)
                {
                    originalArray.RemoveRange(adjustedPosition, diff.DeleteCount);
                    operationOffset -= diff.DeleteCount;
                }

                // Perform insertion
                if (!string.IsNullOrEmpty(diff.Insert))
                {
                    originalArray.InsertRange(adjustedPosition, diff.Insert);
                    operationOffset += diff.Insert.Length;
                }
            }

            return new string(originalArray.ToArray());
        }


        // Diff size computation
        public int CalculateTextDiffFieldSize(List<TextDiff>? textDiffs)
        {
            if (textDiffs == null || textDiffs.Count == 0) return 0;

            int insertSize = 0;
            int deleteSize = 0;

            foreach (var diff in textDiffs)
            {
                insertSize += diff.Insert?.Length ?? 0;
                deleteSize += diff.DeleteCount;
            }

            return insertSize + deleteSize;
        }

        public int CalculateWorkDeltaSize(WorkDelta workDelta)
        {
            int size = 0;

            if (workDelta.Title != null)
            {
                size += CalculateTextDiffFieldSize(workDelta.Title.TextDiffs);
            }
            if (workDelta.Description != null)
            {
                size += CalculateTextDiffFieldSize(workDelta.Description.TextDiffs);
            }
            if (workDelta.Abstract != null)
            {
                size += CalculateTextDiffFieldSize(workDelta.Abstract.TextDiffs);
            }
            if (workDelta.Objective != null)
            {
                size += CalculateTextDiffFieldSize(workDelta.Objective.TextDiffs);
            }
            if (workDelta.Introduction != null)
            {
                size += CalculateTextDiffFieldSize(workDelta.Introduction.TextDiffs);
            }
            if (workDelta.License != null)
            {
                size += CalculateTextDiffFieldSize(workDelta.License.TextDiffs);
            }
            if (workDelta.Publisher != null)
            {
                size += CalculateTextDiffFieldSize(workDelta.Publisher.TextDiffs);
            }
            if (workDelta.Conference != null)
            {
                size += CalculateTextDiffFieldSize(workDelta.Conference.TextDiffs);
            }
            // if (workDelta.ResearchGrants != null)
            // {
            //     size += CalculateTextDiffFieldSize(workDelta.ResearchGrants.TextDiffs);
            // }
            // if (workDelta.Tags != null)
            // {
            //     size += CalculateTextDiffFieldSize(workDelta.Tags.TextDiffs);
            // }
            // if (workDelta.Keywords != null)
            // {
            //     size += CalculateTextDiffFieldSize(workDelta.Keywords.TextDiffs);
            // }

            return size;
        }

        public int CalculateProjectDeltaSize(ProjectDelta? projectDelta)
        {
            if (projectDelta == null) return 0;
            
            int size = 0;

            if (projectDelta.Title != null)
            {
                size += CalculateTextDiffFieldSize(projectDelta.Title.TextDiffs);
            }
            if (projectDelta.Description != null)
            {
                size += CalculateTextDiffFieldSize(projectDelta.Description.TextDiffs);
            }
            if (projectDelta.Abstract != null)
            {
                size += CalculateTextDiffFieldSize(projectDelta.Abstract.TextDiffs);
            }
            if (projectDelta.Introduction != null)
            {
                size += CalculateTextDiffFieldSize(projectDelta.Introduction.TextDiffs);
            }
            if (projectDelta.License != null)
            {
                size += CalculateTextDiffFieldSize(projectDelta.License.TextDiffs);
            }
            if (projectDelta.Publisher != null)
            {
                size += CalculateTextDiffFieldSize(projectDelta.Publisher.TextDiffs);
            }
            if (projectDelta.Conference != null)
            {
                size += CalculateTextDiffFieldSize(projectDelta.Conference.TextDiffs);
            }
            // if (projectDelta.ResearchGrants != null)
            // {
            //     size += CalculateTextDiffFieldSize(projectDelta.ResearchGrants.TextDiffs);
            // }
            // if (projectDelta.Tags != null)
            // {
            //     size += CalculateTextDiffFieldSize(projectDelta.Tags.TextDiffs);
            // }
            // if (projectDelta.Keywords != null)
            // {
            //     size += CalculateTextDiffFieldSize(projectDelta.Keywords.TextDiffs);
            // }

            return size;
        }



        // Conflict detection
        public List<ConflictInfo> DetectConflicts(List<TextDiff> diffs1, List<TextDiff> diffs2)
        {
            var conflicts = new List<ConflictInfo>();

            // Sort diffs by position for better efficiency
            diffs1.Sort((d1, d2) => d1.Position.CompareTo(d2.Position));
            diffs2.Sort((d1, d2) => d1.Position.CompareTo(d2.Position));

            int i = 0, j = 0;
            while (i < diffs1.Count && j < diffs2.Count)
            {
                var diff1 = diffs1[i];
                var diff2 = diffs2[j];

                // Check for overlap
                if (DoDiffsOverlap(diff1, diff2))
                {
                    conflicts.Add(new ConflictInfo { Diff1 = diff1, Diff2 = diff2 });
                }

                // Move to the next diff in one of the lists
                if (diff1.Position + diff1.DeleteCount < diff2.Position + diff2.DeleteCount)
                {
                    i++;
                }
                else
                {
                    j++;
                }
            }


            return conflicts;
        }

        private bool DoDiffsOverlap(TextDiff diff1, TextDiff diff2)
        {
            // Identical operations are not conflicts
            if (diff1.Position == diff2.Position && diff1.DeleteCount == diff2.DeleteCount && diff1.Insert == diff2.Insert)
            {
                return false;
            }

            int diff1Start = diff1.Position;
            int diff1End = diff1.DeleteCount > 0 ? diff1.Position + diff1.DeleteCount : diff1.Position;
            int diff2Start = diff2.Position;
            int diff2End = diff2.DeleteCount > 0 ? diff2.Position + diff2.DeleteCount : diff2.Position;

            // Special handling for insertions at the same position
            if (diff1.DeleteCount == 0 && diff2.DeleteCount == 0)
            {
                // Insertions at the same position with different text are considered a conflict
                return diff1Start == diff2Start && diff1.Insert != diff2.Insert;
            }

            // Check for overlap in other cases
            bool isOverlap = diff1End > diff2Start && diff2End > diff1Start;
            return isOverlap;
        }






    }
}