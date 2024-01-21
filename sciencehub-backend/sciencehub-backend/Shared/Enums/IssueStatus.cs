using NpgsqlTypes;
using System.ComponentModel;

namespace sciencehub_backend.Shared.Enums
{
    public enum IssueStatus
    {
        [PgName("Opened")]
        Opened,

        [PgName("Closed")]
        Closed,
    }
}
