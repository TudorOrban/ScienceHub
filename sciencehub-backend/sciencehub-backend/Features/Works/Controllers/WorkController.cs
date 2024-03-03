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
        private readonly IWorkService _workService;

        public WorkController(IWorkService workService)
        {
            _workService = workService;
        }

        [HttpPost]
        public async Task<ActionResult<WorkBase>> CreateWork([FromBody] CreateWorkDto createWorkDto)
        {
            var work = await _workService.CreateWorkAsync(createWorkDto);
            return CreatedAtRoute("", new { id = work.Id }, work);
        }
    }
}
