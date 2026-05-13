using System.Collections.Generic;
using System.Threading.Tasks;
using Common.DTOs;

namespace TravelPlanService.Interfaces
{
    public interface IExpensesService
    {
        Task<List<ExpenseDTO>> GetForPlanAsync(long travelPlanId);
        Task<ExpenseDTO?> GetByIdAsync(long travelPlanId, long id);
        Task<(bool Success, string? Error, ExpenseDTO? Result)> CreateAsync(long travelPlanId, ExpenseDTO dto);
        Task<(bool Success, string? Error, ExpenseDTO? Result)> UpdateAsync(long travelPlanId, long id, ExpenseDTO dto);
        Task<bool> DeleteAsync(long travelPlanId, long id);
    }
}