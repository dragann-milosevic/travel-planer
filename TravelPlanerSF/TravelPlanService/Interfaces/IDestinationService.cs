using System.Collections.Generic;
using System.Threading.Tasks;
using Common.DTOs;

namespace TravelPlanService.Interfaces
{
    public interface IDestinationService
    {
        Task<List<DestinationDTO>> GetForPlanAsync(long travelPlanId);
        Task<DestinationDTO?> GetByIdAsync(long travelPlanId, long id);
        Task<(bool Success, string? Error, DestinationDTO? Result)> CreateAsync(long travelPlanId, DestinationDTO dto);
        Task<(bool Success, string? Error, DestinationDTO? Result)> UpdateAsync(long travelPlanId, long id, DestinationDTO dto);
        Task<bool> DeleteAsync(long travelPlanId, long id);
    }
}