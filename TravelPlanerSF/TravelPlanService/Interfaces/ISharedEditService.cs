using System.Threading.Tasks;
using Common.DTOs;

namespace TravelPlanService.Interfaces
{
    public interface ISharedEditService
    {
        Task<(bool Success, string? Error, DestinationDTO? Result)> UpdateDestinationAsync(string token, long id, DestinationDTO dto);
        Task<(bool Success, string? Error, ActivityDTO? Result)> UpdateActivityAsync(string token, long id, ActivityDTO dto);
        Task<(bool Success, string? Error, ExpenseDTO? Result)> UpdateExpenseAsync(string token, long id, ExpenseDTO dto);
        Task<(bool Success, string? Error, ChecklistItemDTO? Result)> UpdateChecklistItemAsync(string token, long id, ChecklistItemDTO dto);
    }
}