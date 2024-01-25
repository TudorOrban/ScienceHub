using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Data;
using sciencehub_backend.Features.Works.Models;

namespace sciencehub_backend.Features.Metrics.Research.Services
{
    public class MetricsBackgroundService : BackgroundService
    {
        ResearchMetricsCalculator _researchMetricsCalculator;
        private readonly AppDbContext _context;
        private readonly bool DISABLE_RESEARCH_METRICS_TASK = true;
        private readonly int TIME_BETWEEN_RESEARCH_SCORE_UPDATE = 24;
        private readonly int BATCH_SIZE = 120;

        public MetricsBackgroundService(ResearchMetricsCalculator researchMetricsCalculator, AppDbContext context)
        {
            _researchMetricsCalculator = researchMetricsCalculator;
            _context = context;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                // Trigger calculation
                if (!DISABLE_RESEARCH_METRICS_TASK)
                {
                    await CalculateResearchScoresForAllWorks();
                }

                // Wait for the next run (24 hours)
                await Task.Delay(TimeSpan.FromHours(TIME_BETWEEN_RESEARCH_SCORE_UPDATE), stoppingToken);
            }
        }

        protected async Task CalculateResearchScoresForAllWorks()
        {
            var paperIds = await _context.Papers.Select(p => p.Id).ToListAsync();
            var experimentIds = await _context.Experiments.Select(e => e.Id).ToListAsync();
            var datasetIds = await _context.Datasets.Select(d => d.Id).ToListAsync();
            var dataAnalysisIds = await _context.DataAnalyses.Select(da => da.Id).ToListAsync();
            var aiModelIds = await _context.AIModels.Select(a => a.Id).ToListAsync();
            var codeBlockIds = await _context.CodeBlocks.Select(cb => cb.Id).ToListAsync();

            // Update Research Scores for all works in batches
            await UpdateResearchScoresInBatches(paperIds, "Paper", BATCH_SIZE);
            await UpdateResearchScoresInBatches(experimentIds, "Experiment", BATCH_SIZE);
            await UpdateResearchScoresInBatches(datasetIds, "Dataset", BATCH_SIZE);
            await UpdateResearchScoresInBatches(dataAnalysisIds, "Data Analysis", BATCH_SIZE);
            await UpdateResearchScoresInBatches(aiModelIds, "AI Model", BATCH_SIZE);
            await UpdateResearchScoresInBatches(codeBlockIds, "Code Block", BATCH_SIZE);

        }

        private async Task UpdateResearchScoresInBatches(List<int> ids, string workType, int batchSize)
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
                            _context.Papers.Attach(paperToUpdate);
                            _context.Entry(paperToUpdate).Property(p => p.ResearchScore).IsModified = true;
                            break;
                        case "Experiment":
                            var experimentToUpdate = new Experiment { Id = id, ResearchScore = researchScore };
                            _context.Experiments.Attach(experimentToUpdate);
                            _context.Entry(experimentToUpdate).Property(e => e.ResearchScore).IsModified = true;
                            break;
                        case "Dataset":
                            var datasetToUpdate = new Dataset { Id = id, ResearchScore = researchScore };
                            _context.Datasets.Attach(datasetToUpdate);
                            _context.Entry(datasetToUpdate).Property(d => d.ResearchScore).IsModified = true;
                            break;
                        case "Data Analysis":
                            var dataAnalysisToUpdate = new DataAnalysis { Id = id, ResearchScore = researchScore };
                            _context.DataAnalyses.Attach(dataAnalysisToUpdate);
                            _context.Entry(dataAnalysisToUpdate).Property(da => da.ResearchScore).IsModified = true;
                            break;
                        case "AI Model":
                            var aiModelToUpdate = new AIModel { Id = id, ResearchScore = researchScore };
                            _context.AIModels.Attach(aiModelToUpdate);
                            _context.Entry(aiModelToUpdate).Property(a => a.ResearchScore).IsModified = true;
                            break;
                        case "Code Block":
                            var codeBlockToUpdate = new CodeBlock { Id = id, ResearchScore = researchScore };
                            _context.CodeBlocks.Attach(codeBlockToUpdate);
                            _context.Entry(codeBlockToUpdate).Property(cb => cb.ResearchScore).IsModified = true;
                            break;
                        default:
                            break;
                    }
                }

                // Save changes for each batch
                await _context.SaveChangesAsync();
            }
        }
    }
}