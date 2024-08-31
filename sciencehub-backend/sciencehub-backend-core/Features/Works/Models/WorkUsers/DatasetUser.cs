using sciencehub_backend_core.Core.Users.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend_core.Features.Works.Models.WorkUsers
{
    public class DatasetUser : IWorkUser
    {
        [ForeignKey("Dataset")]
        [Column("dataset_id")]
        public int DatasetId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [Column("role")]
        public string Role { get; set; }

        public Dataset Dataset { get; set; }
        public User User { get; set; }
    }
}
