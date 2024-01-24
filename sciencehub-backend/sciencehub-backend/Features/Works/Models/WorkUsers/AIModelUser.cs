using sciencehub_backend.Core.Users.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Features.Works.Models.WorkUsers
{
    public class AIModelUser : IWorkUser
    {
        [ForeignKey("AIModel")]
        [Column("ai_model_id")]
        public int AIModelId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [Column("role")]
        public string Role { get; set; }

        public AIModel AIModel { get; set; }
        public User User { get; set; }
    }
}
