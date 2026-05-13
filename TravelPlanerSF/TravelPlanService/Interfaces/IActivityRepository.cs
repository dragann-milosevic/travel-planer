using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Interfaces
{
    public interface IActivityRepository
    {
        Task<List<Activity>> GetForPlanAsync(long travelPlanId);
        Task<Activity?> GetByIdAsync(long id);
        Task<Activity> CreateAsync(Activity activity);
        Task<Activity?> UpdateAsync(Activity activity);
        Task<bool> DeleteAsync(long id);
    }
}