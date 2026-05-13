using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Common.DTOs;
using Common.Enums;
using Common.Interfaces;
using TravelPlanService.Interfaces;

namespace TravelPlanService.Services
{
    /// <summary>
    /// Business service for plan sharing.
    /// Persists token state in NotificationService (Stateful, Reliable Dictionary)
    /// via Service Fabric Remoting (V3 pattern).
    /// </summary>
    public class SharingBusinessService : ISharingService
    {
        private readonly ITravelPlansService _travelPlansService;
        private readonly Uri _notificationServiceUri = new Uri("fabric:/TravelPlanerSF/NotificationService");

        public SharingBusinessService(ITravelPlansService travelPlansService)
        {
            _travelPlansService = travelPlansService;
        }

        private INotificationService GetProxy()
        {
            return ServiceProxy.Create<INotificationService>(_notificationServiceUri);
        }

        public async Task<List<ShareLinkDTO>> GetSharesForPlanAsync(long travelPlanId)
        {
            var proxy = GetProxy();
            return await proxy.GetSharesForPlanAsync(travelPlanId);
        }

        public async Task<ShareLinkDTO> CreateAsync(long travelPlanId, ShareAccessType accessType)
        {
            var proxy = GetProxy();
            var link = await proxy.CreateShareTokenAsync(travelPlanId, accessType);

            await proxy.PublishAuditEventAsync(new AuditEventDTO
            {
                Message = $"Share link created for plan {travelPlanId} with {accessType} access",
                ServiceSource = "TravelPlanService",
                Timestamp = DateTime.UtcNow
            });

            return link;
        }

        public async Task<bool> RevokeAsync(long travelPlanId, long shareId)
        {
            var proxy = GetProxy();
            var success = await proxy.RevokeShareAsync(travelPlanId, shareId);

            if (success)
            {
                await proxy.PublishAuditEventAsync(new AuditEventDTO
                {
                    Message = $"Share link {shareId} revoked for plan {travelPlanId}",
                    ServiceSource = "TravelPlanService",
                    Timestamp = DateTime.UtcNow
                });
            }

            return success;
        }

        public async Task<SharedPlanDTO?> OpenSharedAsync(string token)
        {
            var proxy = GetProxy();
            var link = await proxy.ValidateTokenAsync(token);
            if (link == null) return null;

            var plan = await _travelPlansService.GetByIdForSharedAccessAsync(link.TravelPlanId);
            if (plan == null) return null;

            return new SharedPlanDTO
            {
                Plan = plan,
                AccessType = link.AccessType
            };
        }
    }
}