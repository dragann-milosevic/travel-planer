using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Interfaces
{
    public interface IExpenseRepository
    {
        Task<List<Expense>> GetForPlanAsync(long travelPlanId);
        Task<Expense?> GetByIdAsync(long id);
        Task<Expense> CreateAsync(Expense expense);
        Task<Expense?> UpdateAsync(Expense expense);
        Task<bool> DeleteAsync(long id);
    }
}