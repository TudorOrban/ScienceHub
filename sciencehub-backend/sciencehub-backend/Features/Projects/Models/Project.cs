﻿using sciencehub_backend.Core.Users.Models;
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

        [Column("research_score")]
        public int? ResearchScore { get; set; }

        [Column("link")]
        public string Link { get; set; }

        [Column("public")]
        public bool? Public { get; set; }

        [Column("current_project_version_id")]
        public int? CurrentProjectVersionId { get; set; }

        public ICollection<ProjectUser> ProjectUsers { get; set; }
        //[Column("created_at")]
        //public string CreatedAt { get; set; }
    }
}