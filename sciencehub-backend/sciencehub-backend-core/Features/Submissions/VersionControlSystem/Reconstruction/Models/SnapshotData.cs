using sciencehub_backend_core.Features.Works.Models;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Reconstruction.Models
{
    public class SnapshotData
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Objective { get; set; }
        public string? Abstract { get; set; }
        public string? Introduction { get; set; }

        public WorkMetadataNew? WorkMetadata { get; set; }
        public ProjectMetadata? ProjectMetadata { get; set; }
    }
}