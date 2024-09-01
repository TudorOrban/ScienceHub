namespace sciencehub_backend_core.Features.Submissions.DTO
{
    public class GetWorkVersionDTO
    {
        public int WorkId { get; set; }
        public string WorkType { get; set; }
        public int VersionId { get; set; }
    }
}