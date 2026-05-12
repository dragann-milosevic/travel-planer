using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthService.Interfaces;
using AuthService.Models;
using Common.DTOs;
using Common.Enums;

namespace AuthService.Services
{
    public class UserBusinessService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserBusinessService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<UserReadDTO>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(MapToReadDTO).ToList();
        }

        public async Task<UserReadDTO?> GetByIdAsync(long id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return user == null ? null : MapToReadDTO(user);
        }

        public async Task<bool> ChangeRoleAsync(long id, UserRole newRole)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;
            user.Role = newRole;
            var updated = await _userRepository.UpdateAsync(user);
            return updated != null;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            return await _userRepository.DeleteAsync(id);
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