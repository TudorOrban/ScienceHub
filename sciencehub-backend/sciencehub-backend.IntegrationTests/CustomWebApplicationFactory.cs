using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using sciencehub_backend.Data;
using sciencehub_backend.Core.Config;

namespace sciencehub_backend.IntegrationTests
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                var startupAssembly = typeof(Program).Assembly;
                var configBuilder = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json")
                    .AddEnvironmentVariables();

                var config = configBuilder.Build();

                var builder = WebApplication.CreateBuilder();

                ConfigLoader.ConfigureApplication(builder, isTest: true);

                // Optionally, you can add additional test-specific services here
            });
        }
    }

}