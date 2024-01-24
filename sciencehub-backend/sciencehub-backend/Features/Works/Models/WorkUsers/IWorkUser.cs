using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using sciencehub_backend.Core.Users.Models;

namespace sciencehub_backend.Features.Works.Models.WorkUsers
{
    public interface IWorkUser
    {
        Guid UserId { get; }
        string Role { get; }
    }

}