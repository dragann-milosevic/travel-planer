using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Common.DTOs;
using TravelPlanService.Interfaces;

namespace TravelPlanService.Controllers
{
    [ApiController]
    [Route("api/travel-plans/{planId:long}/shares")]
    [Authorize]
    public class SharesController : ControllerBase
    {
        private readonly ISharingService _service;

        public SharesController(ISharingService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetForPlan(long planId)
        {
            var items = await _service.GetSharesForPlanAsync(planId);
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> Create(long planId, [FromBody] ShareLinkCreateDTO dto)
        {
            var link = await _service.CreateAsync(planId, dto.AccessType);
            return Ok(link);
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long planId, long id)
        {
            var success = await _service.RevokeAsync(planId, id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}