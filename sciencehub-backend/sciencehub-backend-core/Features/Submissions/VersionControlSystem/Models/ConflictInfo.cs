using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sciencehub_backend_core.Features.Submissions.VersionControlSystem.Models
{
    public class ConflictInfo
    {
        public TextDiff Diff1 { get; set; }
        public TextDiff Diff2 { get; set; }
    }

}