using Ganss.Xss;
using sciencehub_backend.Shared.Sanitation;

public class SanitizerService : ISanitizerService
{
    private HtmlSanitizer _sanitizer;
    private readonly ILogger<SanitizerService> _logger;

    public SanitizerService(ILogger<SanitizerService> logger, HtmlSanitizer sanitizer = null)
    {
        _sanitizer = sanitizer ?? new HtmlSanitizer();
        _logger = logger;

        ConfigureSanitizer();
    }

    private void ConfigureSanitizer()
    {
        // Configured allowed tags
        _sanitizer.AllowedTags.Clear();
        _sanitizer.AllowedTags.Add("strong");
        _sanitizer.AllowedTags.Add("em");
        _sanitizer.AllowedTags.Add("p");
        _sanitizer.AllowedTags.Add("ul");
        _sanitizer.AllowedTags.Add("ol");
        _sanitizer.AllowedTags.Add("li");
        _sanitizer.AllowedTags.Add("a");

        // Configure allowed attributes
        _sanitizer.AllowedAttributes.Clear();
        _sanitizer.AllowedAttributes.Add("href");
    }

    public string Sanitize(string? input)
    {
        if (input == null)
        {
            return null!;
        }

        // Sanitize
        var sanitizedInput = _sanitizer.Sanitize(input);

        // If discrepancy, log it and continue
        if (sanitizedInput != input)
        {
            _logger.LogWarning($"Input sanitized: original '{input}', sanitized '{sanitizedInput}'");
        }

        return sanitizedInput;
    }
}
