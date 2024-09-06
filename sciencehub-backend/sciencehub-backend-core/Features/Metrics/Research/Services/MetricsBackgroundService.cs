using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Features.Works.Models;

namespace sciencehub_backend_core.Features.Metrics.Research.Services
{
    public class MetricsBackgroundService : BackgroundService
    {
        private readonly IResearchMetricsCalculator _researchMetricsCalculator;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly bool DISABLE_RESEARCH_METRICS_TASK = true;
        private readonly int TIME_BETWEEN_RESEARCH_SCORE_UPDATE = 24;
        private readonly int BATCH_SIZE = 120;

        public MetricsBackgroundService(IServiceScopeFactory scopeFactory, IResearchMetricsCalculator researchMetricsCalculator)
        {
            _scopeFactory = scopeFactory;
            _researchMetricsCalculator = researchMetricsCalculator;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                // Trigger calculation
                if (!DISABLE_RESEARCH_METRICS_TASK)
                {
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<CoreServiceDbContext>();
                        await CalculateResearchScoresForAllWorks(dbContext);
                    }
                }

                // Wait for the next run (24 hours)
                await Task.Delay(TimeSpan.FromHours(TIME_BETWEEN_RESEARCH_SCORE_UPDATE), stoppingToken);
            }
        }

        protected async Task CalculateResearchScoresForAllWorks(CoreServiceDbContext context)
        {
            var workIds = await context.Works.Select(p => p.Id).ToListAsync();

            // Update Research Scores for all works in batches
            await UpdateResearchScoresInBatches(workIds, "Paper", BATCH_SIZE, context);

        }

        private async Task UpdateResearchScoresInBatches(List<int> ids, string workType, int batchSize, CoreServiceDbContext context)
        {
            for (int i = 0; i < ids.Count; i += batchSize)
            {
                var batch = ids.Skip(i).Take(batchSize);

                foreach (var id in batch)
                {
                    var researchScore = await _researchMetricsCalculator.FindWorkResearchScore(id, workType);
                    var paperToUpdate = new Work { Id = id, ResearchScore = researchScore };
                    context.Works.Attach(paperToUpdate);
                    context.Entry(paperToUpdate).Property(p => p.ResearchScore).IsModified = true;
                }

                // Save changes for each batch
                await context.SaveChangesAsync();
            }
        }
    }
}