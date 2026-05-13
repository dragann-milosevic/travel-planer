using System.Collections.Generic;
using System.Threading.Tasks;
using Common.DTOs;

namespace TravelPlanService.Interfaces
{
    public interface IChecklistItemsService
    {
        Task<List<ChecklistItemDTO>> GetForPlanAsync(long travelPlanId);
        Task<(bool Success, string? Error, ChecklistItemDTO? Result)> CreateAsync(long travelPlanId, ChecklistItemDTO dto);
        Task<(bool Success, string? Error, ChecklistItemDTO? Result)> UpdateAsync(long travelPlanId, long id, ChecklistItemDTO dto);
        Task<bool> DeleteAsync(long travelPlanId, long id);
    }
}