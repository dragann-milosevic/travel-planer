using System.Collections.Generic;
using System.Threading.Tasks;
using AuthService.Models;

namespace AuthService.Interfaces
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(long id);
        Task<User?> GetByUserNameAsync(string userName);
        Task<User?> GetByEmailAsync(string email);
        Task<User> CreateAsync(User user);
        Task<User?> UpdateAsync(User user);
        Task<bool> DeleteAsync(long id);
        Task<bool> ExistsByUserNameOrEmailAsync(string userName, string email);
    }
}