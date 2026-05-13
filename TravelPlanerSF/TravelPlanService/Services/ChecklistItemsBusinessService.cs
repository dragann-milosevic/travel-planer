using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.DTOs;
using TravelPlanService.Interfaces;
using TravelPlanService.Models;

namespace TravelPlanService.Services
{
    public class ChecklistItemsBusinessService : IChecklistItemsService
    {
        private readonly IChecklistItemRepository _repository;

        public ChecklistItemsBusinessService(IChecklistItemRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ChecklistItemDTO>> GetForPlanAsync(long travelPlanId)
        {
            var items = await _repository.GetForPlanAsync(travelPlanId);
            return items.Select(Map).ToList();
        }

        public async Task<(bool Success, string? Error, ChecklistItemDTO? Result)> CreateAsync(long travelPlanId, ChecklistItemDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Text))
                return (false, "Item text is required.", null);

            var entity = new ChecklistItem
            {
                TravelPlanId = travelPlanId,
                Text = dto.Text,
                Completed = dto.Completed
            };

            entity = await _repository.CreateAsync(entity);
            return (true, null, Map(entity));
        }

        public async Task<(bool Success, string? Error, ChecklistItemDTO? Result)> UpdateAsync(long travelPlanId, long id, ChecklistItemDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Text))
                return (false, "Item text is required.", null);

            var existing = await _repository.GetByIdAsync(id);
            if (existing == null || existing.TravelPlanId != travelPlanId)
                return (false, "Item not found.", null);

            existing.Text = dto.Text;
            existing.Completed = dto.Completed;

            var updated = await _repository.UpdateAsync(existing);
            if (updated == null) return (false, "Update failed.", null);
            return (true, null, Map(updated));
        }

        public async Task<bool> DeleteAsync(long travelPlanId, long id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null || existing.TravelPlanId != travelPlanId) return false;
            return await _repository.DeleteAsync(id);
        }

        private static ChecklistItemDTO Map(ChecklistItem c) => new ChecklistItemDTO
        {
            Id = c.Id,
            TravelPlanId = c.TravelPlanId,
            Text = c.Text,
            Completed = c.Completed
        };
    }
}