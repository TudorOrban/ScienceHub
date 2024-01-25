﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Shared.Serialization;

namespace sciencehub_backend.Features.Projects.Models
{
    [Table("project_versions_graphs")]
    public class ProjectGraph
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("project_id")]
        public int ProjectId { get; set; }

        private CustomJsonSerializer _serializer = new CustomJsonSerializer();

        [Column("graph_data", TypeName = "jsonb")]
        public string GraphDataJson { get; set; }

        private GraphData _cachedGraphData = null;

        [NotMapped]
        public GraphData GraphData
        {
            get => _cachedGraphData ??= _serializer.DeserializeFromJson<GraphData>(GraphDataJson);
            set
            {
                _cachedGraphData = value;
                GraphDataJson = _serializer.SerializeToJson(value);
            }
        }
    }
}

