using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.DTOs;
using TravelPlanService.Interfaces;
using TravelPlanService.Models;

namespace TravelPlanService.Services
{
    public class ExpensesBusinessService : IExpensesService
    {
        private readonly IExpenseRepository _repository;

        public ExpensesBusinessService(IExpenseRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ExpenseDTO>> GetForPlanAsync(long travelPlanId)
        {
            var items = await _repository.GetForPlanAsync(travelPlanId);
            return items.Select(Map).ToList();
        }

        public async Task<ExpenseDTO?> GetByIdAsync(long travelPlanId, long id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null || item.TravelPlanId != travelPlanId) return null;
            return Map(item);
        }

        public async Task<(bool Success, string? Error, ExpenseDTO? Result)> CreateAsync(long travelPlanId, ExpenseDTO dto)
        {
            var error = Validate(dto);
            if (error != null) return (false, error, null);

            var entity = new Expense
            {
                TravelPlanId = travelPlanId,
                Name = dto.Name,
                Category = dto.Category,
                Amount = dto.Amount,
                Date = dto.Date,
                Description = dto.Description ?? string.Empty
            };

            entity = await _repository.CreateAsync(entity);
            return (true, null, Map(entity));
        }

        public async Task<(bool Success, string? Error, ExpenseDTO? Result)> UpdateAsync(long travelPlanId, long id, ExpenseDTO dto)
        {
            var error = Validate(dto);
            if (error != null) return (false, error, null);

            var existing = await _repository.GetByIdAsync(id);
            if (existing == null || existing.TravelPlanId != travelPlanId)
                return (false, "Expense not found.", null);

            existing.Name = dto.Name;
            existing.Category = dto.Category;
            existing.Amount = dto.Amount;
            existing.Date = dto.Date;
            existing.Description = dto.Description ?? string.Empty;

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

        private static string? Validate(ExpenseDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return "Expense name is required.";
            if (dto.Amount < 0)
                return "Amount cannot be negative.";
            return null;
        }

        private static ExpenseDTO Map(Expense e) => new ExpenseDTO
        {
            Id = e.Id,
            TravelPlanId = e.TravelPlanId,
            Name = e.Name,
            Category = e.Category,
            Amount = e.Amount,
            Date = e.Date,
            Description = e.Description
        };
    }
}