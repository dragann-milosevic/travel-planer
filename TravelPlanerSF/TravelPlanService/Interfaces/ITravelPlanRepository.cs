using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Interfaces
{
    public interface ITravelPlanRepository
    {
        Task<List<TravelPlan>> GetAllForOwnerAsync(long ownerId);
        Task<List<TravelPlan>> GetAllAsync();
        Task<TravelPlan?> GetByIdAsync(long id);
        Task<TravelPlan?> GetByIdWithDetailsAsync(long id);
        Task<TravelPlan> CreateAsync(TravelPlan plan);
        Task<TravelPlan?> UpdateAsync(TravelPlan plan);
        Task<bool> DeleteAsync(long id);
    }
}