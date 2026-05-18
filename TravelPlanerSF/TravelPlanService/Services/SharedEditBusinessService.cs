using System;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Common.DTOs;
using Common.Enums;
using Common.Interfaces;
using TravelPlanService.Interfaces;

namespace TravelPlanService.Services
{
    // Token-gated edits for users coming through a share link.
    // Validates the token via NotificationService (Reliable Dictionary), enforces EDIT access,
    // then delegates to the existing business services with the plan ID resolved from the token.
    public class SharedEditBusinessService : ISharedEditService
    {
        private readonly IDestinationService _destinationService;
        private readonly IActivitiesService _activitiesService;
        private readonly IExpensesService _expensesService;
        private readonly IChecklistItemsService _checklistService;
        private readonly Uri _notificationServiceUri = new Uri("fabric:/TravelPlanerSF/NotificationService");

        public SharedEditBusinessService(
            IDestinationService destinationService,
            IActivitiesService activitiesService,
            IExpensesService expensesService,
            IChecklistItemsService checklistService)
        {
            _destinationService = destinationService;
            _activitiesService = activitiesService;
            _expensesService = expensesService;
            _checklistService = checklistService;
        }

        private INotificationService GetProxy()
        {
            return ServiceProxy.Create<INotificationService>(_notificationServiceUri, new ServicePartitionKey(0));
        }

        private async Task<(bool Ok, string? Error, long PlanId)> AuthorizeAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return (false, "Token is required.", 0);

            var link = await GetProxy().ValidateTokenAsync(token);
            if (link == null)
                return (false, "Invalid or expired share link.", 0);

            if (link.AccessType != ShareAccessType.Edit)
                return (false, "This share link is view-only.", 0);

            return (true, null, link.TravelPlanId);
        }

        public async Task<(bool Success, string? Error, DestinationDTO? Result)> UpdateDestinationAsync(string token, long id, DestinationDTO dto)
        {
            var (ok, error, planId) = await AuthorizeAsync(token);
            if (!ok) return (false, error, null);
            return await _destinationService.UpdateAsync(planId, id, dto);
        }

        public async Task<(bool Success, string? Error, ActivityDTO? Result)> UpdateActivityAsync(string token, long id, ActivityDTO dto)
        {
            var (ok, error, planId) = await AuthorizeAsync(token);
            if (!ok) return (false, error, null);
            return await _activitiesService.UpdateAsync(planId, id, dto);
        }

        public async Task<(bool Success, string? Error, ExpenseDTO? Result)> UpdateExpenseAsync(string token, long id, ExpenseDTO dto)
        {
            var (ok, error, planId) = await AuthorizeAsync(token);
            if (!ok) return (false, error, null);
            return await _expensesService.UpdateAsync(planId, id, dto);
        }

        public async Task<(bool Success, string? Error, ChecklistItemDTO? Result)> UpdateChecklistItemAsync(string token, long id, ChecklistItemDTO dto)
        {
            var (ok, error, planId) = await AuthorizeAsync(token);
            if (!ok) return (false, error, null);
            return await _checklistService.UpdateAsync(planId, id, dto);
        }
    }
}