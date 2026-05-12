using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AuthService.Interfaces;
using Common.DTOs;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<UserReadDTO>>> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserReadDTO>> GetMe()
        {
            var idClaim = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.NameId)?.Value
                          ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!long.TryParse(idClaim, out var id))
                return Unauthorized();

            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpGet("{id:long}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserReadDTO>> GetById(long id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPut("{id:long}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ChangeRole(long id, [FromBody] ChangeRoleDTO dto)
        {
            var success = await _userService.ChangeRoleAsync(id, dto.Role);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(long id)
        {
            var success = await _userService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}