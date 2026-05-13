using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Common.DTOs;
using TravelPlanService.Interfaces;

namespace TravelPlanService.Controllers
{
    [ApiController]
    [Route("api/travel-plans")]
    [Authorize]
    public class TravelPlansController : ControllerBase
    {
        private readonly ITravelPlansService _service;

        public TravelPlansController(ITravelPlansService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ownerId = GetUserId();
            if (ownerId == null) return Unauthorized();

            var plans = await _service.GetAllForOwnerAsync(ownerId.Value);
            return Ok(plans);
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            var ownerId = GetUserId();
            if (ownerId == null) return Unauthorized();

            var plan = await _service.GetByIdAsync(id, ownerId.Value);
            if (plan == null) return NotFound();
            return Ok(plan);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TravelPlanDTO dto)
        {
            var ownerId = GetUserId();
            if (ownerId == null) return Unauthorized();

            var (success, error, plan) = await _service.CreateAsync(dto, ownerId.Value);
            if (!success) return BadRequest(error);
            return CreatedAtAction(nameof(GetById), new { id = plan!.Id }, plan);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromBody] TravelPlanDTO dto)
        {
            var ownerId = GetUserId();
            if (ownerId == null) return Unauthorized();

            var (success, error, plan) = await _service.UpdateAsync(id, dto, ownerId.Value);
            if (!success) return BadRequest(error);
            return Ok(plan);
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            var ownerId = GetUserId();
            if (ownerId == null) return Unauthorized();

            var success = await _service.DeleteAsync(id, ownerId.Value);
            if (!success) return NotFound();
            return NoContent();
        }

        private long? GetUserId()
        {
            var idClaim = User.FindFirst(JwtRegisteredClaimNames.NameId)?.Value
                          ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return long.TryParse(idClaim, out var id) ? id : null;
        }
    }
}