using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Data;
using sciencehub_backend.Exceptions.Errors;
using sciencehub_backend.Features.Submissions.VersionControlSystem.Models;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Shared.Enums;

namespace sciencehub_backend.Features.Submissions.VersionControlSystem.Reconstruction.Services
{
    public class WorkGraphService
    {
        private readonly AppDbContext _context;

        public WorkGraphService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<WorkGraph> fetchWorkGraph(int workId, string workType)
        {
            WorkType? workTypeEnum = EnumParser.ParseWorkType(workType);
            if (workTypeEnum == null)
            {
                throw new InvalidWorkTypeException();
            }

            WorkGraph? workGraph = await _context.WorkGraphs.FirstOrDefaultAsync(w => w.WorkId == workId && w.WorkType == workTypeEnum);
            if (workGraph == null)
            {
                throw new Exception("Work graph not found");
            }

            return workGraph;
        }
    }
}