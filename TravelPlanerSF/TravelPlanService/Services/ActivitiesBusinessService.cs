using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.DTOs;
using TravelPlanService.Interfaces;
using TravelPlanService.Models;

namespace TravelPlanService.Services
{
    public class ActivitiesBusinessService : IActivitiesService
    {
        private readonly IActivityRepository _repository;

        public ActivitiesBusinessService(IActivityRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ActivityDTO>> GetForPlanAsync(long travelPlanId)
        {
            var items = await _repository.GetForPlanAsync(travelPlanId);
            return items.Select(Map).ToList();
        }

        public async Task<ActivityDTO?> GetByIdAsync(long travelPlanId, long id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null || item.TravelPlanId != travelPlanId) return null;
            return Map(item);
        }

        public async Task<(bool Success, string? Error, ActivityDTO? Result)> CreateAsync(long travelPlanId, ActivityDTO dto)
        {
            var error = Validate(dto);
            if (error != null) return (false, error, null);

            var entity = new Activity
            {
                TravelPlanId = travelPlanId,
                DestinationId = dto.DestinationId,
                Name = dto.Name,
                Date = dto.Date,
                Time = dto.Time ?? string.Empty,
                Location = dto.Location ?? string.Empty,
                Description = dto.Description ?? string.Empty,
                EstimatedCost = dto.EstimatedCost,
                Status = dto.Status
            };

            entity = await _repository.CreateAsync(entity);
            return (true, null, Map(entity));
        }

        public async Task<(bool Success, string? Error, ActivityDTO? Result)> UpdateAsync(long travelPlanId, long id, ActivityDTO dto)
        {
            var error = Validate(dto);
            if (error != null) return (false, error, null);

            var existing = await _repository.GetByIdAsync(id);
            if (existing == null || existing.TravelPlanId != travelPlanId)
                return (false, "Activity not found.", null);

            existing.DestinationId = dto.DestinationId;
            existing.Name = dto.Name;
            existing.Date = dto.Date;
            existing.Time = dto.Time ?? string.Empty;
            existing.Location = dto.Location ?? string.Empty;
            existing.Description = dto.Description ?? string.Empty;
            existing.EstimatedCost = dto.EstimatedCost;
            existing.Status = dto.Status;

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

        private static string? Validate(ActivityDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return "Activity name is required.";
            if (dto.EstimatedCost < 0)
                return "Estimated cost cannot be negative.";
            return null;
        }

        private static ActivityDTO Map(Activity a) => new ActivityDTO
        {
            Id = a.Id,
            TravelPlanId = a.TravelPlanId,
            DestinationId = a.DestinationId,
            Name = a.Name,
            Date = a.Date,
            Time = a.Time,
            Location = a.Location,
            Description = a.Description,
            EstimatedCost = a.EstimatedCost,
            Status = a.Status
        };
    }
}