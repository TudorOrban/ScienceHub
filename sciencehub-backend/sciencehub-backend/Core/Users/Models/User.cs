using sciencehub_backend.features.Projects.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Core.Users.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public string Id { get; set; }

        [Column("username")]
        public string Username { get; set; }

        [Column("full_name")]
        public string FullName { get; set; }

        public List<Project> Projects { get; set; }
    }
}
