using DiffPlex.DiffBuilder.Model;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Services
{
    public interface ITextDiffManager
    {
        List<TextDiff> CalculateDiffs(string initialText, string newText);
        List<TextDiff> FormatDiffs(DiffPaneModel diffResult);
        string ApplyTextDiffs(string original, List<TextDiff> diffs);
        int CalculateTextDiffFieldSize(List<TextDiff>? textDiffs);
        int CalculateWorkDeltaSize(WorkDelta workDelta);
        int CalculateProjectDeltaSize(ProjectDelta? projectDelta);
        List<ConflictInfo> DetectConflicts(List<TextDiff> diffs1, List<TextDiff> diffs2);
    }
}