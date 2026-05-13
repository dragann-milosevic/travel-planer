using System.Collections.Generic;
using System.Threading.Tasks;
using TravelPlanService.Models;

namespace TravelPlanService.Interfaces
{
    public interface IDestinationRepository
    {
        Task<List<Destination>> GetForPlanAsync(long travelPlanId);
        Task<Destination?> GetByIdAsync(long id);
        Task<Destination> CreateAsync(Destination destination);
        Task<Destination?> UpdateAsync(Destination destination);
        Task<bool> DeleteAsync(long id);
    }
}