using System.ComponentModel;

namespace sciencehub_backend.Shared.Enums
{
    public enum WorkType
    {
        [EnumDescription("Paper")]
        Paper,

        [EnumDescription("Experiment")]
        Experiment,

        [EnumDescription("Dataset")]
        Dataset,

        [EnumDescription("Data Analysis")]
        DataAnalysis,

        [EnumDescription("AI Model")]
        AIModel,

        [EnumDescription("Code Block")]
        CodeBlock,
    }
}
