using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_core.Core.Users.Models;

namespace sciencehub_backend_core.Features.NewWorks.Models
{
    public class WorkUser
    {
        [ForeignKey("Work")]
        [Column("work_id")]
        public int workId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public int UserId { get; set; }
        
        public Work? Work { get; set; }
        public User? User { get; set; }
    }

}