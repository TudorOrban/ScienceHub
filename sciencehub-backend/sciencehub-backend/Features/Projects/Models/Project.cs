using sciencehub_backend.Core.Users.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.features.Projects.Models
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
        public string Description { get; set; }

        public List<User> Users { get; set; }

        [Column("research_score")]
        public int? ResearchScore { get; set; }

        [Column("public")]
        public bool? Public { get; set; }
        //[Column("created_at")]
        //public string CreatedAt { get; set; }
    }
}
