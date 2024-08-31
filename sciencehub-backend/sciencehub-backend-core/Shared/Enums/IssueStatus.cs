using NpgsqlTypes;
using System.ComponentModel;

namespace sciencehub_backend_core.Shared.Enums
{
    public enum IssueStatus
    {
        [PgName("Opened")]
        Opened,

        [PgName("Closed")]
        Closed,
    }
}
