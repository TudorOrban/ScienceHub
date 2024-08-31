using sciencehub_backend_core.Features.Issues.Models;
using sciencehub_backend_core.Features.Projects.Models;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Features.Submissions.Models;
using sciencehub_backend_core.Features.Works.Models.WorkUsers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend_core.Core.Users.Models
{
    public class SmallUser
    {
        public string Id { get; set; }

        public string Username { get; set; }

        public string FullName { get; set; }
        
    }
}
