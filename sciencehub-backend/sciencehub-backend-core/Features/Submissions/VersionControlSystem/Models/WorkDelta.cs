using Microsoft.EntityFrameworkCore;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models
{
    public class WorkDelta
    {
        // WorkBase properties
        public DiffInfo? Title { get; set; }
        public DiffInfo? Description { get; set; }

        // Properties on special works
        public DiffInfo? Objective { get; set; }
        public DiffInfo? Abstract { get; set; }
        public DiffInfo? Introduction { get; set; }

        // Metadata properties
        public DiffInfo? License { get; set; }
        public DiffInfo? Publisher { get; set; }
        public DiffInfo? Conference { get; set; }
        public DiffInfo? ResearchGrants { get; set; }
        
        public DiffInfo? Tags { get; set; }
        public DiffInfo? Keywords { get; set; }

    }
}