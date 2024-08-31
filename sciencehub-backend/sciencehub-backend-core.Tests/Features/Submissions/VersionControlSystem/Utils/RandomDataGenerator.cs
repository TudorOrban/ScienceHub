namespace sciencehub_backend_core.Tests.Features.Submissions.VersionControlSystem.Utils
{
    public class RandomDataGenerator
    {
        private static readonly Random random = new Random();

        public static int GenerateRandomInteger(int max)
        {
            return random.Next(max);
        }

        public static int GenerateRandomSign()
        {
            return random.Next(0, 2) * 2 - 1;
        }

        public static string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public static string GenerateStringModification(string original)
        {
            var modified = original;
            int numberOfModifications = Math.Max(1, original.Length / 100);

            for (int i = 0; i < numberOfModifications; i++)
            {
                if (random.NextDouble() > 0.5 && modified.Length > 10)
                {
                    // Perform a deletion
                    int deleteStart = GenerateRandomInteger(modified.Length - 10);
                    int deleteEnd = GenerateRandomInteger(Math.Min(10, modified.Length - deleteStart));
                    modified = modified.Substring(0, deleteStart) + modified.Substring(deleteEnd);
                }
                else
                {
                    // Perform an insertion
                    int insertPosition = GenerateRandomInteger(modified.Length);
                    string stringToInsert = GenerateRandomString(GenerateRandomInteger(10) + 1);
                    modified = modified.Substring(0, insertPosition) + stringToInsert + modified.Substring(insertPosition);
                }
            }

            return modified;
        }
    }
}