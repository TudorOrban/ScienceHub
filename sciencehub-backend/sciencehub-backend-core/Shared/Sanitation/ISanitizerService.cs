namespace sciencehub_backend_core.Shared.Sanitation
{
    public interface ISanitizerService
    {
        string Sanitize(string? input);
    }
}