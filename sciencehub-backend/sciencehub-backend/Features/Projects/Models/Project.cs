using sciencehub_backend.Core.Users.Models;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Features.Works.Models.ProjectWorks;
using sciencehub_backend.Shared.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Features.Projects.Models
{
    [Table("projects")]
    public class Project
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("title")]
        public string Title { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [Column("research_score")]
        public int? ResearchScore { get; set; }

        [Column("link")]
        public string? Link { get; set; }

        [Column("public")]
        public bool? Public { get; set; }

        [Column("current_project_version_id")]
        public int? CurrentProjectVersionId { get; set; }
        
        private CustomJsonSerializer _serializer = new CustomJsonSerializer();

        [Column("project_metadata", TypeName = "jsonb")]
        public string? ProjectMetadataJson { get; set; }

        private ProjectMetadata _cachedProjectMetadata = null;

        [NotMapped]
        public ProjectMetadata ProjectMetadata
        {
            get => _cachedProjectMetadata ??= _serializer.DeserializeFromJson<ProjectMetadata>(ProjectMetadataJson);
            set
            {
                _cachedProjectMetadata = value;
                ProjectMetadataJson = _serializer.SerializeToJson(value);
            }
        }

        public ICollection<ProjectUser> ProjectUsers { get; set; }
        public ICollection<ProjectPaper> ProjectPapers { get; set; }
        public ICollection<ProjectExperiment> ProjectExperiments { get; set; }
        public ICollection<ProjectDataset> ProjectDatasets { get; set; }
        public ICollection<ProjectDataAnalysis> ProjectDataAnalyses { get; set; }
        public ICollection<ProjectAIModel> ProjectAIModels { get; set; }
        public ICollection<ProjectCodeBlock> ProjectCodeBlocks { get; set; }
        //[Column("created_at")]
        //public string CreatedAt { get; set; }
    }
}
