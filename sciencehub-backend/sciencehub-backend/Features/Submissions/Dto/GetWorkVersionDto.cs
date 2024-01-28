namespace sciencehub_backend.Features.Submissions.Dto
{
    public class GetWorkVersionDto
    {
        public int WorkId { get; set; }
        public string WorkType { get; set; }
        public int VersionId { get; set; }
    }
}