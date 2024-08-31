using NpgsqlTypes;
using System.ComponentModel;

namespace sciencehub_backend_core.Shared.Enums
{
    public enum ReviewStatus
    {
        [PgName("In progress")]
        InProgress,

        [PgName("Submitted")]
        Submitted,
    }
}
