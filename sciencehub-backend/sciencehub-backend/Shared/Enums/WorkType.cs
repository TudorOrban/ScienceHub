using NpgsqlTypes;
using System.ComponentModel;
using System.Runtime.Serialization;

namespace sciencehub_backend.Shared.Enums
{
    public enum WorkType
    {
        [PgName("Paper")]
        Paper,

        [PgName("Experiment")]
        Experiment,

        [PgName("Dataset")]
        Dataset,

        [PgName("Data Analysis")]
        DataAnalysis,

        [PgName("AI Model")]
        AIModel,

        [PgName("Code Block")]
        CodeBlock,
    }
}
