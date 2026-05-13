using System.Collections.Generic;
using System.Threading.Tasks;
using Common.DTOs;

namespace TravelPlanService.Interfaces
{
    public interface IActivitiesService
    {
        Task<List<ActivityDTO>> GetForPlanAsync(long travelPlanId);
        Task<ActivityDTO?> GetByIdAsync(long travelPlanId, long id);
        Task<(bool Success, string? Error, ActivityDTO? Result)> CreateAsync(long travelPlanId, ActivityDTO dto);
        Task<(bool Success, string? Error, ActivityDTO? Result)> UpdateAsync(long travelPlanId, long id, ActivityDTO dto);
        Task<bool> DeleteAsync(long travelPlanId, long id);
    }
}