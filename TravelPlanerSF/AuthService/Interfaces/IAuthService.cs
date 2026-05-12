using System.Threading.Tasks;
using Common.DTOs;

namespace AuthService.Interfaces
{
    public class AuthResult
    {
        public bool Success { get; set; }
        public string? Token { get; set; }
        public string? Error { get; set; }
        public UserReadDTO? User { get; set; }
    }

    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(LoginDTO dto);
        Task<AuthResult> RegisterAsync(RegisterDTO dto);
    }
}