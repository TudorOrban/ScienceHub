using Microsoft.EntityFrameworkCore;
using sciencehub_backend_core.Data;
using sciencehub_backend_core.Exceptions.Errors;
using sciencehub_backend_core.Features.Reviews.Models;
using sciencehub_backend_core.Shared.Enums;
using sciencehub_backend_core.Shared.Search;

namespace sciencehub_backend_core.Features.Reviews.Repositories
{
    public class WorkReviewRepository : IWorkReviewRepository
    {
        private readonly CoreServiceDbContext _context;

        public WorkReviewRepository(CoreServiceDbContext context)
        {
            _context = context;
        }

        public async Task<WorkReview> FindWorkReviewByIdAsync(int reviewId)
        {
            var review = await _context.WorkReviews.FindAsync(reviewId);
            if (review == null)
            {
                throw new InvalidWorkReviewIdException();
            }

            return review;
        }

        // Search
        public async Task<PaginatedResults<WorkReview>> SearchWorkReviewsByWorkIdAsync(int workId, WorkType workType, SearchParams searchParams)
        {
            var query = _context.WorkReviews
                .Where(pr => pr.WorkId == workId && pr.WorkType == workType);

            if (!string.IsNullOrEmpty(searchParams.SearchQuery))
            {
                query = query.Where(pr => pr.Title.Contains(searchParams.SearchQuery));
            }

            query = ApplySorting(query, searchParams.SortBy, searchParams.SortDescending);

            var totalItemCount = await query.CountAsync();

            var workReviews = await query
                .Skip(((searchParams.Page ?? 1) - 1) * (searchParams.ItemsPerPage ?? 10))
                .Take(searchParams.ItemsPerPage ?? 10)
                .ToListAsync();

            return new PaginatedResults<WorkReview>
            {
                Results = workReviews,
                TotalCount = totalItemCount
            };
        }
        
        private IQueryable<WorkReview> ApplySorting(IQueryable<WorkReview> query, string? sortBy, bool descending)
        {
            switch (sortBy)
            {
                case "Title":
                    query = descending ? query.OrderByDescending(p => p.Title) : query.OrderBy(p => p.Title);
                    break;
                case "createdAt":
                    query = descending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt);
                    break;
                default:
                    throw new ArgumentException("Invalid sort field", nameof(sortBy));
            }
            return query;
        }

        public async Task<List<WorkReview>> FindWorkReviewsByWorkIdAsync(int workId, WorkType workType)
        {
            return await _context.WorkReviews.Where(pr => pr.WorkId == workId && pr.WorkType == workType).ToListAsync();
        }

        // Create
        public async Task<WorkReview> CreateWorkReviewAsync(WorkReview newWorkReview, IEnumerable<string> userIdStrings)
        {
            _context.WorkReviews.Add(newWorkReview);
            await _context.SaveChangesAsync();

            await AddUsersToReviewAsync(userIdStrings, newWorkReview.Id);

            return newWorkReview;
        }

        private async Task AddUsersToReviewAsync(IEnumerable<string> userIdStrings, int reviewId)
        {
            foreach (var userIdString in userIdStrings)
            {
                if (!Guid.TryParse(userIdString, out var userId))
                {
                    return;
                }
                _context.WorkReviewUsers.Add(new WorkReviewUser { WorkReviewId = reviewId, UserId = userId });
            }
            await _context.SaveChangesAsync();
        }

        // Update
        public async Task<WorkReview> UpdateWorkReviewAsync(WorkReview workReview)
        {
            _context.WorkReviews.Update(workReview);
            await _context.SaveChangesAsync();

            return workReview;
        }

        // Delete
        public async Task<int> DeleteWorkReviewAsync(int reviewId)
        {
            var review = await FindWorkReviewByIdAsync(reviewId);
            _context.WorkReviews.Remove(review);
            return await _context.SaveChangesAsync();
        }
    }
}