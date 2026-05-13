using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.DTOs;
using TravelPlanService.Interfaces;
using TravelPlanService.Models;

namespace TravelPlanService.Services
{
    public class DestinationsBusinessService : IDestinationService
    {
        private readonly IDestinationRepository _repository;

        public DestinationsBusinessService(IDestinationRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<DestinationDTO>> GetForPlanAsync(long travelPlanId)
        {
            var items = await _repository.GetForPlanAsync(travelPlanId);
            return items.Select(Map).ToList();
        }

        public async Task<DestinationDTO?> GetByIdAsync(long travelPlanId, long id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null || item.TravelPlanId != travelPlanId) return null;
            return Map(item);
        }

        public async Task<(bool Success, string? Error, DestinationDTO? Result)> CreateAsync(long travelPlanId, DestinationDTO dto)
        {
            var error = Validate(dto);
            if (error != null) return (false, error, null);

            var entity = new Destination
            {
                TravelPlanId = travelPlanId,
                Name = dto.Name,
                Location = dto.Location,
                ArrivalDate = dto.ArrivalDate,
                DepartureDate = dto.DepartureDate,
                Description = dto.Description
            };

            entity = await _repository.CreateAsync(entity);
            return (true, null, Map(entity));
        }

        public async Task<(bool Success, string? Error, DestinationDTO? Result)> UpdateAsync(long travelPlanId, long id, DestinationDTO dto)
        {
            var error = Validate(dto);
            if (error != null) return (false, error, null);

            var existing = await _repository.GetByIdAsync(id);
            if (existing == null || existing.TravelPlanId != travelPlanId)
                return (false, "Destination not found.", null);

            existing.Name = dto.Name;
            existing.Location = dto.Location;
            existing.ArrivalDate = dto.ArrivalDate;
            existing.DepartureDate = dto.DepartureDate;
            existing.Description = dto.Description;

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

        private static string? Validate(DestinationDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return "Destination name is required.";
            if (string.IsNullOrWhiteSpace(dto.Location))
                return "Location is required.";
            if (dto.DepartureDate < dto.ArrivalDate)
                return "Departure date cannot be before arrival date.";
            return null;
        }

        private static DestinationDTO Map(Destination d) => new DestinationDTO
        {
            Id = d.Id,
            TravelPlanId = d.TravelPlanId,
            Name = d.Name,
            Location = d.Location,
            ArrivalDate = d.ArrivalDate,
            DepartureDate = d.DepartureDate,
            Description = d.Description
        };
    }
}