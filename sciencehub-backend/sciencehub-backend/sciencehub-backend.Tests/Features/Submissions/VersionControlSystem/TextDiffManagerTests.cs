using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Tests.Features.Submissions.VersionControlSystem.Utils;

namespace sciencehub_backend.Tests.Features.Submissions.VersionControlSystem
{
    public class TextDiffManagerTests
    {
        private readonly TextDiffManager _textDiffManager;

        public TextDiffManagerTests()
        {
            _textDiffManager = new TextDiffManager();
        }

        [Fact]
        public void SingleCalculateApplyTest()
        {
            string originalText = RandomDataGenerator.GenerateRandomString(200);
            string modifiedText = RandomDataGenerator.GenerateStringModification(originalText);

            var diffs = _textDiffManager.CalculateDiffs(originalText, modifiedText);
            var result = _textDiffManager.ApplyTextDiffs(originalText, diffs);

            Assert.Equal(modifiedText, result);
        }

        [Fact]
        public void SequentialCalculateApplyTest()
        {
            string originalText = RandomDataGenerator.GenerateRandomString(200);
            string intermediateText = RandomDataGenerator.GenerateStringModification(originalText);
            string finalText = RandomDataGenerator.GenerateStringModification(intermediateText);

            // First diff application
            var diffs1 = _textDiffManager.CalculateDiffs(originalText, intermediateText);
            var result1 = _textDiffManager.ApplyTextDiffs(originalText, diffs1);

            // Second diff application
            var diffs2 = _textDiffManager.CalculateDiffs(result1, finalText);
            var result2 = _textDiffManager.ApplyTextDiffs(result1, diffs2);

            // Initial-final diff application
            var diffs0 = _textDiffManager.CalculateDiffs(originalText, finalText);
            var result0 = _textDiffManager.ApplyTextDiffs(originalText, diffs0);

            // Assert final result equality
            Assert.Equal(finalText, result2);
            Assert.Equal(finalText, result0);
        }

        [Fact]
        public void DetectConflicts_NonOverlappingEdits_NoConflict()
        {
            string baseText = "The quick brown fox jumps over the lazy dog";
            string modifiedText1 = "The quick brown fox leaps over the lazy dog";
            string modifiedText2 = "The quick brown fox jumps over the smart dog";

            var diffs1 = _textDiffManager.CalculateDiffs(baseText, modifiedText1);
            var diffs2 = _textDiffManager.CalculateDiffs(baseText, modifiedText2);

            var conflicts = _textDiffManager.DetectConflicts(diffs1, diffs2);

            Assert.Empty(conflicts);
        }

        [Fact]
        public void ManualConflictDetection_OverlappingEdits_ConflictDetected()
        {
            // Manually create diffs for first modification
            var diffs1 = new List<TextDiff>
    {
        new TextDiff { Position = 10, DeleteCount = 5, Insert = "swift" }, // Replace 'quick' with 'swift'
        new TextDiff { Position = 40, DeleteCount = 0, Insert = "cute " }  // Insert 'cute ' before 'dog'
    };

            // Manually create diffs for second modification
            var diffs2 = new List<TextDiff>
    {
        new TextDiff { Position = 14, DeleteCount = 5, Insert = "black" }, // Replace 'brown' with 'black'
        new TextDiff { Position = 30, DeleteCount = 4, Insert = "smart" }  // Replace 'lazy' with 'smart'
    };

            var conflicts = _textDiffManager.DetectConflicts(diffs1, diffs2);

            // There should be a conflict due to overlapping modifications around 'quick'/'swift' and 'brown'/'black'
            Assert.NotEmpty(conflicts);
            Assert.Single(conflicts); // Expecting exactly one conflict
        }


        //[Fact]
        //public void DetectConflicts_OverlappingEdits_ConflictDetected()
        //{
        //    string baseText = "The quick brown fox jumps over the lazy dog";
        //    string modifiedText1 = "The quick red fox jumps over the lazy dog";
        //    string modifiedText2 = "The quick brown fox jumps over the crazy dog";

        //    var diffs1 = _textDiffManager.CalculateDiffs(baseText, modifiedText1);
        //    var diffs2 = _textDiffManager.CalculateDiffs(baseText, modifiedText2);

        //    var conflicts = _textDiffManager.DetectConflicts(diffs1, diffs2);

        //    Assert.NotEmpty(conflicts); // Expect at least one conflict
        //}

        [Fact]
        public void DetectConflicts_ComplexEdits_SomeConflicts()
        {
            string baseText = "The quick brown fox jumps over the lazy dog";
            // Modification 1: Change 'quick' to 'swift', insert 'cute' before 'dog'
            string modifiedText1 = "The swift brown fox jumps over the lazy cute dog";
            // Modification 2: Change 'brown' to 'black', 'lazy' to 'sleepy'
            string modifiedText2 = "The quick black fox jumps over the sleepy dog";

            var diffs1 = _textDiffManager.CalculateDiffs(baseText, modifiedText1);
            var diffs2 = _textDiffManager.CalculateDiffs(baseText, modifiedText2);

            var conflicts = _textDiffManager.DetectConflicts(diffs1, diffs2);

            // Expect conflicts due to changes in 'quick'/'swift' and 'brown'/'black'
            // No conflict in 'lazy'/'sleepy' and the insertion of 'cute'
            Assert.NotEmpty(conflicts);
            Assert.Equal(2, conflicts.Count);
        }



    }
}