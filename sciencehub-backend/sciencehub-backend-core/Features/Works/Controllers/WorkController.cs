using Microsoft.AspNetCore.Mvc;
using sciencehub_backend_core.Features.Works.DTO;
using sciencehub_backend_core.Features.Works.Models;
using sciencehub_backend_core.Features.Works.Services;

namespace sciencehub_backend_core.Features.Works.Controllers
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
        public async Task<ActionResult<WorkBase>> CreateWork([FromBody] CreateWorkDTO createWorkDTO)
        {
            var work = await _workService.CreateWorkAsync(createWorkDTO);
            return CreatedAtRoute("", new { id = work.Id }, work);
        }
    }
}
