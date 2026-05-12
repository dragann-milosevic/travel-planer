using System.Threading.Tasks;
using AuthService.Interfaces;
using AuthService.Models;
using AuthService.Utils;
using Common.DTOs;
using Common.Enums;

namespace AuthService.Services
{
    public class AuthBusinessService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly TokenGenerator _tokenGenerator;

        public AuthBusinessService(IUserRepository userRepository, TokenGenerator tokenGenerator)
        {
            _userRepository = userRepository;
            _tokenGenerator = tokenGenerator;
        }

        public async Task<AuthResult> LoginAsync(LoginDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Password))
                return new AuthResult { Success = false, Error = "Password is required." };

            User? user = null;

            if (!string.IsNullOrWhiteSpace(dto.UserName))
                user = await _userRepository.GetByUserNameAsync(dto.UserName);

            if (user == null && !string.IsNullOrWhiteSpace(dto.Email))
                user = await _userRepository.GetByEmailAsync(dto.Email);

            if (user == null)
                return new AuthResult { Success = false, Error = "User does not exist." };

            if (!PasswordHasher.Verify(dto.Password, user.PasswordHash))
                return new AuthResult { Success = false, Error = "Invalid password." };

            var token = _tokenGenerator.Generate(user);

            return new AuthResult
            {
                Success = true,
                Token = token,
                User = MapToReadDTO(user)
            };
        }

        public async Task<AuthResult> RegisterAsync(RegisterDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.UserName) || dto.UserName.Length < 3)
                return new AuthResult { Success = false, Error = "Username must be at least 3 characters long." };

            if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains('@'))
                return new AuthResult { Success = false, Error = "Email is not valid." };

            if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
                return new AuthResult { Success = false, Error = "Password must be at least 6 characters long." };

            if (await _userRepository.ExistsByUserNameOrEmailAsync(dto.UserName, dto.Email))
                return new AuthResult { Success = false, Error = "Username or email is already taken." };

            var user = new User
            {
                FirstName = dto.FirstName ?? string.Empty,
                LastName = dto.LastName ?? string.Empty,
                UserName = dto.UserName,
                Email = dto.Email,
                PasswordHash = PasswordHasher.Hash(dto.Password),
                Role = UserRole.User
            };

            user = await _userRepository.CreateAsync(user);
            var token = _tokenGenerator.Generate(user);

            return new AuthResult
            {
                Success = true,
                Token = token,
                User = MapToReadDTO(user)
            };
        }

        private static UserReadDTO MapToReadDTO(User user) => new UserReadDTO
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            Role = user.Role
        };
    }
}