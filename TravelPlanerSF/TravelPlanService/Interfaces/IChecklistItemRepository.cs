using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Interfaces
{
    public interface IChecklistItemRepository
    {
        Task<List<ChecklistItem>> GetForPlanAsync(long travelPlanId);
        Task<ChecklistItem?> GetByIdAsync(long id);
        Task<ChecklistItem> CreateAsync(ChecklistItem item);
        Task<ChecklistItem?> UpdateAsync(ChecklistItem item);
        Task<bool> DeleteAsync(long id);
    }
}