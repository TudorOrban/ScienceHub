

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://*:{port}");

var app = sciencehub_backend_core.Core.Config.ConfigLoader.ConfigureApplication(builder, false);

// Test log
app.Logger.LogInformation("Hello, world!");
app.Run();


public partial class Program { }