using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sciencehub_backend.Features.Metrics.Research.Models
{
    public class WorkWithCitationDepth
    {
        public int Id { get; set; }
        public string WorkType { get; set; }
        public List<Citation> Citations { get; set; }
    }

    public class Citation
    {
        public int Id { get; set; }
        public int SourceWorkId { get; set; }
        public string SourceWorkType { get; set; }
        public int TargetWorkId { get; set; }
        public string TargetWorkType { get; set; }
        public List<WorkWithCitations>? SourceWorks { get; set; }
    }

    public class WorkWithCitations
    {
        public int Id { get; set; }
        public string WorkType { get; set; }
        public int CitationsCount { get; set; }
    }
}