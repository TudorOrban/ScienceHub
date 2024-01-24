using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Core.Users.Models;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Models
{
    [Keyless]
    public class TextDiff
    {
        public int Position { get; set; }
        public int DeleteCount { get; set; }
        public string Insert { get; set; }
    }

    public class DiffInfo
    {
        public string Type { get; set; }
        public List<TextDiff> TextDiffs { get; set; }
        public List<string> TextArrays { get; set; }
        public string LastChangeDate { get; set; }
        public SmallUser LastChangeUser { get; set; }
    }

    public class FileChanges
    {
        public FileLocation? fileToBeRemoved { get; set; }
        public FileLocation? fileToBeAdded { get; set; }
        public FileLocation? fileToBeUpdated { get; set; }
    }

    public class FileLocation
    {
        public string Filename { get; set; }
        public string bucketFilename { get; set; }
        public string? fileType { get; set; } // PDF || Dataset || CodeFile || AIModel
        public string? fileSubtype { get; set; } // .xlsx, .java etc
    }

    public class SubmittedData
    {
        public string? Date { get; set; }
        public SmallUser[] Users { get; set; }
    }

    public class AcceptedData
    {
        public string? Date { get; set; }
        public SmallUser[] Users { get; set; }
    }
}