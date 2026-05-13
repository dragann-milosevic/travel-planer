using System.Collections.Generic;
using System.Threading.Tasks;
using Common.DTOs;
using Common.Enums;

namespace TravelPlanService.Interfaces
{
    public interface ISharingService
    {
        Task<List<ShareLinkDTO>> GetSharesForPlanAsync(long travelPlanId);
        Task<ShareLinkDTO> CreateAsync(long travelPlanId, ShareAccessType accessType);
        Task<bool> RevokeAsync(long travelPlanId, long shareId);
        Task<SharedPlanDTO?> OpenSharedAsync(string token);
    }
}