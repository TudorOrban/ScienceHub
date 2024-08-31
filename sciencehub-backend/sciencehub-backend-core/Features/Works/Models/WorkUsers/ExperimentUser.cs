using sciencehub_backend_core.Core.Users.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend_core.Features.Works.Models.WorkUsers
{
    public class ExperimentUser : IWorkUser
    {
        [ForeignKey("Experiment")]
        [Column("experiment_id")]
        public int ExperimentId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [Column("role")]
        public string Role { get; set; }

        public Experiment Experiment { get; set; }
        public User User { get; set; }
    }
}
