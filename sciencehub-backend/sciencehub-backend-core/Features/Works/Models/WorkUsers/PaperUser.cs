using sciencehub_backend_core.Core.Users.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend_core.Features.Works.Models.WorkUsers
{
    public class PaperUser : IWorkUser
    {
        [ForeignKey("Paper")]
        [Column("paper_id")]
        public int PaperId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [Column("role")]
        public string Role { get; set; }

        public Paper Paper { get; set; }
        public User User { get; set; }
    }
}
