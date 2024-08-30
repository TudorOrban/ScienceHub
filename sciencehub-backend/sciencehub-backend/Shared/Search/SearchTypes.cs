namespace sciencehub_backend.Shared.Search
{
    public class PaginatedResults<T>
    {
        public List<T> Results { get; set; }
        public int TotalCount { get; set; }
    }
}
