using System.Collections.Generic;
using System.Threading.Tasks;
using Common.DTOs;

namespace TravelPlanService.Interfaces
{
    public interface ITravelPlansService
    {
        Task<List<TravelPlanReadDTO>> GetAllForOwnerAsync(long ownerId);
        Task<TravelPlanReadDTO?> GetByIdAsync(long id, long ownerId);
        // Used only for shared (token-validated) access — owner check bypassed.
        Task<TravelPlanReadDTO?> GetByIdForSharedAccessAsync(long id);
        Task<(bool Success, string? Error, TravelPlanReadDTO? Plan)> CreateAsync(TravelPlanDTO dto, long ownerId);
        Task<(bool Success, string? Error, TravelPlanReadDTO? Plan)> UpdateAsync(long id, TravelPlanDTO dto, long ownerId);
        Task<bool> DeleteAsync(long id, long ownerId);
    }
}