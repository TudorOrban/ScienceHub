using NpgsqlTypes;
using System.ComponentModel;

namespace sciencehub_backend.Shared.Enums
{
    public enum ReviewStatus
    {
        [PgName("In progress")]
        InProgress,

        [PgName("Submitted")]
        Submitted,
    }
}
