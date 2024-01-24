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
    }
}