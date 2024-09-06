using sciencehub_backend_core.Features.NewWorks.Models;
using sciencehub_backend_core.Features.Projects.Models;

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