using System.ComponentModel;

namespace sciencehub_backend.Shared.Enums
{
    public enum SubmissionStatus
    {
        [EnumDescription("In progress")]
        InProgress,

        [EnumDescription("Submitted")]
        Submitted,

        [EnumDescription("Accepted")]
        Accepted
    }
}
