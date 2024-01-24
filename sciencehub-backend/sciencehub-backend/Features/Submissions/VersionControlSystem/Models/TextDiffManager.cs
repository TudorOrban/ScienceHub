
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
    }
}