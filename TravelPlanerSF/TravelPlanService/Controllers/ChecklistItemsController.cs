using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Common.DTOs;
using TravelPlanService.Interfaces;

namespace TravelPlanService.Controllers
{
    [ApiController]
    [Route("api/travel-plans/{planId:long}/checklist-items")]
    [Authorize]
    public class ChecklistItemsController : ControllerBase
    {
        private readonly IChecklistItemsService _service;

        public ChecklistItemsController(IChecklistItemsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetForPlan(long planId)
        {
            var items = await _service.GetForPlanAsync(planId);
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> Create(long planId, [FromBody] ChecklistItemDTO dto)
        {
            var (success, error, result) = await _service.CreateAsync(planId, dto);
            if (!success) return BadRequest(error);
            return Ok(result);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long planId, long id, [FromBody] ChecklistItemDTO dto)
        {
            var (success, error, result) = await _service.UpdateAsync(planId, id, dto);
            if (!success) return BadRequest(error);
            return Ok(result);
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long planId, long id)
        {
            var success = await _service.DeleteAsync(planId, id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}