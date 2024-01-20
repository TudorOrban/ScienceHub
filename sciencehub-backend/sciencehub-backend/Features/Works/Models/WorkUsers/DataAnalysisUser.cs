using sciencehub_backend.Core.Users.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Features.Works.Models.WorkUsers
{
    public class DataAnalysisUser
    {
        [ForeignKey("DataAnalysis")]
        [Column("data_analysis_id")]
        public int DataAnalysisId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [Column("role")]
        public string Role { get; set; }

        public DataAnalysis DataAnalysis { get; set; }
        public User User { get; set; }
    }
}
