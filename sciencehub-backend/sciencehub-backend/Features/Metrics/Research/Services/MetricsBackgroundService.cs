using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Data;
using sciencehub_backend.Features.Works.Models;

namespace sciencehub_backend.Features.Metrics.Research.Services
{
    public class MetricsBackgroundService : BackgroundService
    {
        ResearchMetricsCalculator _researchMetricsCalculator;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly bool DISABLE_RESEARCH_METRICS_TASK = true;
        private readonly int TIME_BETWEEN_RESEARCH_SCORE_UPDATE = 24;
        private readonly int BATCH_SIZE = 120;

        public MetricsBackgroundService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
            _researchMetricsCalculator = new ResearchMetricsCalculator();
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
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        await CalculateResearchScoresForAllWorks(dbContext);
                    }
                }

                // Wait for the next run (24 hours)
                await Task.Delay(TimeSpan.FromHours(TIME_BETWEEN_RESEARCH_SCORE_UPDATE), stoppingToken);
            }
        }

        protected async Task CalculateResearchScoresForAllWorks(AppDbContext context)
        {
            var paperIds = await context.Papers.Select(p => p.Id).ToListAsync();
            var experimentIds = await context.Experiments.Select(e => e.Id).ToListAsync();
            var datasetIds = await context.Datasets.Select(d => d.Id).ToListAsync();
            var dataAnalysisIds = await context.DataAnalyses.Select(da => da.Id).ToListAsync();
            var aiModelIds = await context.AIModels.Select(a => a.Id).ToListAsync();
            var codeBlockIds = await context.CodeBlocks.Select(cb => cb.Id).ToListAsync();

            // Update Research Scores for all works in batches
            await UpdateResearchScoresInBatches(paperIds, "Paper", BATCH_SIZE, context);
            await UpdateResearchScoresInBatches(experimentIds, "Experiment", BATCH_SIZE, context);
            await UpdateResearchScoresInBatches(datasetIds, "Dataset", BATCH_SIZE, context);
            await UpdateResearchScoresInBatches(dataAnalysisIds, "Data Analysis", BATCH_SIZE, context);
            await UpdateResearchScoresInBatches(aiModelIds, "AI Model", BATCH_SIZE, context);
            await UpdateResearchScoresInBatches(codeBlockIds, "Code Block", BATCH_SIZE, context);

        }

        private async Task UpdateResearchScoresInBatches(List<int> ids, string workType, int batchSize, AppDbContext context)
        {
            for (int i = 0; i < ids.Count; i += batchSize)
            {
                var batch = ids.Skip(i).Take(batchSize);

                foreach (var id in batch)
                {
                    var researchScore = await _researchMetricsCalculator.FindWorkResearchScore(id, workType);
                    switch (workType)
                    {
                        case "Paper":
                            var paperToUpdate = new Paper { Id = id, ResearchScore = researchScore };
                            context.Papers.Attach(paperToUpdate);
                            context.Entry(paperToUpdate).Property(p => p.ResearchScore).IsModified = true;
                            break;
                        case "Experiment":
                            var experimentToUpdate = new Experiment { Id = id, ResearchScore = researchScore };
                            context.Experiments.Attach(experimentToUpdate);
                            context.Entry(experimentToUpdate).Property(e => e.ResearchScore).IsModified = true;
                            break;
                        case "Dataset":
                            var datasetToUpdate = new Dataset { Id = id, ResearchScore = researchScore };
                            context.Datasets.Attach(datasetToUpdate);
                            context.Entry(datasetToUpdate).Property(d => d.ResearchScore).IsModified = true;
                            break;
                        case "Data Analysis":
                            var dataAnalysisToUpdate = new DataAnalysis { Id = id, ResearchScore = researchScore };
                            context.DataAnalyses.Attach(dataAnalysisToUpdate);
                            context.Entry(dataAnalysisToUpdate).Property(da => da.ResearchScore).IsModified = true;
                            break;
                        case "AI Model":
                            var aiModelToUpdate = new AIModel { Id = id, ResearchScore = researchScore };
                            context.AIModels.Attach(aiModelToUpdate);
                            context.Entry(aiModelToUpdate).Property(a => a.ResearchScore).IsModified = true;
                            break;
                        case "Code Block":
                            var codeBlockToUpdate = new CodeBlock { Id = id, ResearchScore = researchScore };
                            context.CodeBlocks.Attach(codeBlockToUpdate);
                            context.Entry(codeBlockToUpdate).Property(cb => cb.ResearchScore).IsModified = true;
                            break;
                        default:
                            break;
                    }
                }

                // Save changes for each batch
                await context.SaveChangesAsync();
            }
        }
    }
}