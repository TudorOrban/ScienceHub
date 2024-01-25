
using DiffPlex;
using DiffPlex.DiffBuilder;
using DiffPlex.DiffBuilder.Model;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Models
{
    public class TextDiffManager
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