using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AuthService.Interfaces;
using Common.DTOs;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            if (dto == null)
                return BadRequest("Request body is empty.");

            var result = await _authService.LoginAsync(dto);
            if (!result.Success)
                return Unauthorized(result.Error);

            return Ok(new { token = result.Token, user = result.User });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            if (dto == null)
                return BadRequest("Request body is empty.");

            var result = await _authService.RegisterAsync(dto);
            if (!result.Success)
                return BadRequest(result.Error);

            return Ok(new { token = result.Token, user = result.User });
        }
    }
}