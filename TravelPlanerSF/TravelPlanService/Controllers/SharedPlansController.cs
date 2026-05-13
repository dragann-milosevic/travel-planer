using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlanService.Interfaces;

namespace TravelPlanService.Controllers
{
    /// <summary>
    /// Public endpoint for accessing a plan via a share token.
    /// No authentication required — token presence is the auth.
    /// </summary>
    [ApiController]
    [Route("api/shared-plans")]
    [AllowAnonymous]
    public class SharedPlansController : ControllerBase
    {
        private readonly ISharingService _service;

        public SharedPlansController(ISharingService service)
        {
            _service = service;
        }

        [HttpGet("{token}")]
        public async Task<IActionResult> Get(string token)
        {
            var shared = await _service.OpenSharedAsync(token);
            if (shared == null) return NotFound("Invalid or expired share link.");
            return Ok(shared);
        }
    }
}