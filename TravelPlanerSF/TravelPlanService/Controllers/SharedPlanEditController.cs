using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Common.DTOs;
using TravelPlanService.Interfaces;

namespace TravelPlanService.Controllers
{
    // Public PUT endpoints for editing a plan via an EDIT share token; no JWT required.
    // Token authorizes the request and resolves the target plan inside the service layer.
    [ApiController]
    [Route("api/shared-plans/{token}")]
    [AllowAnonymous]
    public class SharedPlanEditController : ControllerBase
    {
        private readonly ISharedEditService _service;

        public SharedPlanEditController(ISharedEditService service)
        {
            _service = service;
        }

        [HttpPut("destinations/{id:long}")]
        public async Task<IActionResult> UpdateDestination(string token, long id, [FromBody] DestinationDTO dto)
        {
            var (success, error, result) = await _service.UpdateDestinationAsync(token, id, dto);
            if (!success) return BadRequest(error);
            return Ok(result);
        }

        [HttpPut("activities/{id:long}")]
        public async Task<IActionResult> UpdateActivity(string token, long id, [FromBody] ActivityDTO dto)
        {
            var (success, error, result) = await _service.UpdateActivityAsync(token, id, dto);
            if (!success) return BadRequest(error);
            return Ok(result);
        }

        [HttpPut("expenses/{id:long}")]
        public async Task<IActionResult> UpdateExpense(string token, long id, [FromBody] ExpenseDTO dto)
        {
            var (success, error, result) = await _service.UpdateExpenseAsync(token, id, dto);
            if (!success) return BadRequest(error);
            return Ok(result);
        }

        [HttpPut("checklist-items/{id:long}")]
        public async Task<IActionResult> UpdateChecklistItem(string token, long id, [FromBody] ChecklistItemDTO dto)
        {
            var (success, error, result) = await _service.UpdateChecklistItemAsync(token, id, dto);
            if (!success) return BadRequest(error);
            return Ok(result);
        }
    }
}