using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Services.Remoting;
using Common.DTOs;
using Common.Enums;

namespace Common.Interfaces
{
    public interface INotificationService : IService
    {
        // Share token operations (Reliable Dictionary)
        Task<ShareLinkDTO> CreateShareTokenAsync(long travelPlanId, ShareAccessType accessType);
        Task<ShareLinkDTO?> ValidateTokenAsync(string token);
        Task<List<ShareLinkDTO>> GetSharesForPlanAsync(long travelPlanId);
        Task<bool> RevokeShareAsync(long travelPlanId, long shareId);
        Task<int> RevokeAllSharesForPlanAsync(long travelPlanId);

        // Audit log operations (Reliable Queue)
        Task PublishAuditEventAsync(AuditEventDTO auditEvent);
    }
}