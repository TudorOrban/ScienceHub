using sciencehub_backend.Features.Issues.Models;
using sciencehub_backend.Features.Projects.Models;
using sciencehub_backend.Features.Reviews.Models;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Works.Models.WorkUsers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend.Core.Users.Models
{
    public class SmallUser
    {
        public string Id { get; set; }

        public string Username { get; set; }

        public string FullName { get; set; }
        
    }
}
