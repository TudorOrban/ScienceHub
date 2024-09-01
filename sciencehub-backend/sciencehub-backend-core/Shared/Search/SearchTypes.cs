namespace sciencehub_backend_core.Shared.Search
{
    public class PaginatedResults<T>
    {
        public List<T> Results { get; set; } = new List<T>();
        public int TotalCount { get; set; }
    }

    public class SearchParams
    {
        public string? SearchQuery { get; set; }
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; }
        public int? Page { get; set; }
        public int? ItemsPerPage { get; set; }

    }
}
