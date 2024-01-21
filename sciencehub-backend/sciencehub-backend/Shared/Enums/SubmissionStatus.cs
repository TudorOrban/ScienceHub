using NpgsqlTypes;
using System.ComponentModel;

namespace sciencehub_backend.Shared.Enums
{
    public enum SubmissionStatus
    {
        [PgName("In progress")]
        InProgress,

        [PgName("Submitted")]
        Submitted,

        [PgName("Accepted")]
        Accepted
    }
}
