using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Common.DTOs;
using TravelPlanService.Interfaces;

namespace TravelPlanService.Controllers
{
    [ApiController]
    [Route("api/travel-plans/{planId:long}/activities")]
    [Authorize]
    public class ActivitiesController : ControllerBase
    {
        private readonly IActivitiesService _service;

        public ActivitiesController(IActivitiesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetForPlan(long planId)
        {
            var items = await _service.GetForPlanAsync(planId);
            return Ok(items);
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long planId, long id)
        {
            var item = await _service.GetByIdAsync(planId, id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(long planId, [FromBody] ActivityDTO dto)
        {
            var (success, error, result) = await _service.CreateAsync(planId, dto);
            if (!success) return BadRequest(error);
            return CreatedAtAction(nameof(GetById), new { planId, id = result!.Id }, result);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long planId, long id, [FromBody] ActivityDTO dto)
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