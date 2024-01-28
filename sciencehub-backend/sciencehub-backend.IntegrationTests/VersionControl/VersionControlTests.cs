using Microsoft.AspNetCore.Mvc.Testing;
using sciencehub_backend.Features.Submissions.Models;
using sciencehub_backend.Features.Works.Models;
using System.Text;
using System.Text.Json;

namespace sciencehub_backend.IntegrationTests.VersionControl
{
    public class VersionControlTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly CustomWebApplicationFactory _factory;
        private readonly HttpClient _client;

        public VersionControlTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient(new WebApplicationFactoryClientOptions
            {
                BaseAddress = new Uri("http://localhost:5183/")
            });
        }

        [Theory]
        [InlineData("/api/v1/projects")]
        public async Task Get_EndpointsReturnSuccessAndCorrectContentType(string url)
        {
            // Arrange
            // Act
            var response = await _client.GetAsync(url);

            // Assert
            response.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                response.Content.Headers.ContentType.ToString());
        }


        //[Fact]
        //public async Task TestVersionControlWorkflow()
        //{
        //    var work = await CreateWork();
        //    Assert.NotNull(work);

        //    var submissionId = await CreateSubmission(work.Id, work.CurrentWorkVersionId ?? 0);


        //    await AcceptSubmission(submissionId);
        //}

        //private async Task<WorkBase> CreateWork()
        //{
        //    var workPayload = new
        //    {
        //        workType = "Paper",
        //        title = "Graph test work",
        //        description = "Test graph",
        //        users = new string[] { "2d1ddabf-426c-4ab0-b78b-a687a91fe49b", "794f5523-2fa2-4e22-9f2f-8234ac15829a" },
        //        @public = true,
        //    };

        //    var response = await _client.PostAsync("api/v1/works", new StringContent(JsonSerializer.Serialize(workPayload), Encoding.UTF8, "application/json"));
        //    // Include error handling here for debugging
        //    if (!response.IsSuccessStatusCode)
        //    {
        //        var errorContent = await response.Content.ReadAsStringAsync();
        //        throw new HttpRequestException($"Request failed with status {response.StatusCode}: {errorContent}");
        //    }

        //    var responseContent = await response.Content.ReadAsStringAsync();
        //    var workResponse = JsonSerializer.Deserialize<WorkBase>(responseContent);
        //    return workResponse;
        //}


        //private async Task<int> CreateSubmission(int workId, int initialWorkVersionId)
        //{
        //    var submissionPayload = new
        //    {
        //        submissionObjectType = "Work",
        //        workId = workId,
        //        workType = "Code Block",
        //        // projectSubmissionId = "122",
        //        title = "CreateSubmissionTest1<div>",
        //        description = "Project-Work-Submission Test2",
        //        initialWorkVersionId = initialWorkVersionId,
        //        users = new string[] { "2d1ddabf-426c-4ab0-b78b-a687a91fe49b", "794f5523-2fa2-4e22-9f2f-8234ac15829a" },
        //        @public = true,
        //    };

        //    var response = await _client.PostAsync("api/v1/submissions", new StringContent(JsonSerializer.Serialize(submissionPayload), Encoding.UTF8, "application/json"));
        //    // Include error handling here for debugging
        //    if (!response.IsSuccessStatusCode)
        //    {
        //        var errorContent = await response.Content.ReadAsStringAsync();
        //        throw new HttpRequestException($"Request failed with status {response.StatusCode}: {errorContent}");
        //    }

        //    var responseContent = await response.Content.ReadAsStringAsync();
        //    var workSubmissionResponse = JsonSerializer.Deserialize<int>(responseContent);
        //    return workSubmissionResponse;
        //}

        //private async Task<WorkSubmission> AcceptSubmission(int submissionId)
        //{
        //    var acceptSubmissionPayload = "794f5523-2fa2-4e22-9f2f-8234ac15829a";

        //    var response = await _client.PostAsync($"api/v1/submissions/work-submissions/{submissionId}/accept", new StringContent(JsonSerializer.Serialize(acceptSubmissionPayload), Encoding.UTF8, "application/json"));
        //    response.EnsureSuccessStatusCode();

        //    var responseContent = await response.Content.ReadAsStringAsync();
        //    var workSubmissionResponse = JsonSerializer.Deserialize<WorkSubmission>(responseContent);
        //    return workSubmissionResponse;
        //}

    }
}