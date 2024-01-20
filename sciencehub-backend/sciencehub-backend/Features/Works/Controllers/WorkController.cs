using Microsoft.AspNetCore.Mvc;
using sciencehub_backend.Features.Works.Dto;
using sciencehub_backend.Features.Works.Models;
using sciencehub_backend.Features.Works.Services;

namespace sciencehub_backend.Features.Works.Controllers
{
    [ApiController]
    [Route("api/v1/works")]
    public class WorkController : ControllerBase
    {
        private readonly WorkService _workService;

        public WorkController(WorkService workService)
        {
            _workService = workService;
        }

        [HttpPost]
        public async Task<ActionResult<WorkBase>> CreateWork([FromBody] CreateWorkDto createWorkDto, [FromServices] SanitizerService sanitizerService)
        {
            var work = await _workService.CreateWorkAsync(createWorkDto, sanitizerService);
            return CreatedAtRoute("", new { id = work.Id }, work);
        }
    }
}
