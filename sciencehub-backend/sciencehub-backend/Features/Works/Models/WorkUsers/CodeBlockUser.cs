using sciencehub_backend.Core.Users.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Features.Works.Models.WorkUsers
{
    public class CodeBlockUser : IWorkUser
    {
        [ForeignKey("CodeBlock")]
        [Column("code_block_id")]
        public int CodeBlockId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [Column("role")]
        public string Role { get; set; }

        public CodeBlock CodeBlock { get; set; }
        public User User { get; set; }
    }
}
