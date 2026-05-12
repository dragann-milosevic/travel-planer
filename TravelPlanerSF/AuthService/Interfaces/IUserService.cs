using System.Collections.Generic;
using System.Threading.Tasks;
using Common.DTOs;
using Common.Enums;

namespace AuthService.Interfaces
{
    public interface IUserService
    {
        Task<List<UserReadDTO>> GetAllAsync();
        Task<UserReadDTO?> GetByIdAsync(long id);
        Task<bool> ChangeRoleAsync(long id, UserRole newRole);
        Task<bool> DeleteAsync(long id);
    }
}