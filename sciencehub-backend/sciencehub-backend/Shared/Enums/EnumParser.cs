namespace sciencehub_backend.Shared.Enums
{
    public class EnumParser
    {
        // Parse work type enum
        public static WorkType? ParseWorkType(string? workTypeString)
        {
            switch (workTypeString)
            {
                case "Paper":
                    return WorkType.Paper;
                case "Experiment":
                    return WorkType.Experiment;
                case "Dataset":
                    return WorkType.Dataset;
                case "Data Analysis":
                    return WorkType.DataAnalysis;
                case "AI Model":
                    return WorkType.AIModel;
                case "Code Block":
                    return WorkType.CodeBlock;
                default:
                    return null;
            }
        }
    }
}