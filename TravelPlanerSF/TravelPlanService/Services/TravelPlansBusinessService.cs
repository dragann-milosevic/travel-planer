using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.DTOs;
using TravelPlanService.Interfaces;
using TravelPlanService.Models;

namespace TravelPlanService.Services
{
    public class TravelPlansBusinessService : ITravelPlansService
    {
        private readonly ITravelPlanRepository _repository;

        public TravelPlansBusinessService(ITravelPlanRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<TravelPlanReadDTO>> GetAllForOwnerAsync(long ownerId)
        {
            var plans = await _repository.GetAllForOwnerAsync(ownerId);
            return plans.Select(MapToRead).ToList();
        }

        public async Task<TravelPlanReadDTO?> GetByIdAsync(long id, long ownerId)
        {
            var plan = await _repository.GetByIdWithDetailsAsync(id);
            if (plan == null || plan.OwnerId != ownerId) return null;
            return MapToReadDetailed(plan);
        }

        public async Task<TravelPlanReadDTO?> GetByIdForSharedAccessAsync(long id)
        {
            var plan = await _repository.GetByIdWithDetailsAsync(id);
            if (plan == null) return null;
            return MapToReadDetailed(plan);
        }

        public async Task<(bool Success, string? Error, TravelPlanReadDTO? Plan)> CreateAsync(TravelPlanDTO dto, long ownerId)
        {
            var validationError = Validate(dto);
            if (validationError != null) return (false, validationError, null);

            var plan = new TravelPlan
            {
                OwnerId = ownerId,
                Name = dto.Name,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Budget = dto.Budget,
                Notes = dto.Notes
            };

            plan = await _repository.CreateAsync(plan);
            return (true, null, MapToRead(plan));
        }

        public async Task<(bool Success, string? Error, TravelPlanReadDTO? Plan)> UpdateAsync(long id, TravelPlanDTO dto, long ownerId)
        {
            var validationError = Validate(dto);
            if (validationError != null) return (false, validationError, null);

            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return (false, "Plan not found.", null);
            if (existing.OwnerId != ownerId) return (false, "You do not have permission to edit this plan.", null);

            existing.Name = dto.Name;
            existing.Description = dto.Description;
            existing.StartDate = dto.StartDate;
            existing.EndDate = dto.EndDate;
            existing.Budget = dto.Budget;
            existing.Notes = dto.Notes;

            var updated = await _repository.UpdateAsync(existing);
            if (updated == null) return (false, "Update failed.", null);
            return (true, null, MapToRead(updated));
        }

        public async Task<bool> DeleteAsync(long id, long ownerId)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null || existing.OwnerId != ownerId) return false;
            return await _repository.DeleteAsync(id);
        }

        private static string? Validate(TravelPlanDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return "Plan name is required.";
            if (dto.EndDate < dto.StartDate)
                return "End date cannot be before start date.";
            if (dto.Budget < 0)
                return "Budget cannot be negative.";
            return null;
        }

        private static TravelPlanReadDTO MapToRead(TravelPlan p) => new TravelPlanReadDTO
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            Budget = p.Budget,
            Notes = p.Notes,
            OwnerId = p.OwnerId
        };

        private static TravelPlanReadDTO MapToReadDetailed(TravelPlan p)
        {
            var dto = MapToRead(p);
            dto.Destinations = p.Destinations.Select(d => new DestinationDTO
            {
                Id = d.Id,
                TravelPlanId = d.TravelPlanId,
                Name = d.Name,
                Location = d.Location,
                ArrivalDate = d.ArrivalDate,
                DepartureDate = d.DepartureDate,
                Description = d.Description
            }).ToList();
            dto.Activities = p.Activities.Select(a => new ActivityDTO
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
            }).ToList();
            dto.Expenses = p.Expenses.Select(e => new ExpenseDTO
            {
                Id = e.Id,
                TravelPlanId = e.TravelPlanId,
                Name = e.Name,
                Category = e.Category,
                Amount = e.Amount,
                Date = e.Date,
                Description = e.Description
            }).ToList();
            dto.ChecklistItems = p.ChecklistItems.Select(c => new ChecklistItemDTO
            {
                Id = c.Id,
                TravelPlanId = c.TravelPlanId,
                Text = c.Text,
                Completed = c.Completed
            }).ToList();
            return dto;
        }
    }
}