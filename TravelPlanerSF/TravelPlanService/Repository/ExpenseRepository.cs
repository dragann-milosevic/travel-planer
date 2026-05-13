using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelPlanService.Interfaces;
using TravelPlanService.Models;

namespace TravelPlanService.Repository
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly TravelPlanDbContext _context;

        public ExpenseRepository(TravelPlanDbContext context)
        {
            _context = context;
        }

        public async Task<List<Expense>> GetForPlanAsync(long travelPlanId)
        {
            return await _context.Expenses
                .AsNoTracking()
                .Where(e => e.TravelPlanId == travelPlanId)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<Expense?> GetByIdAsync(long id)
        {
            return await _context.Expenses.FindAsync(id);
        }

        public async Task<Expense> CreateAsync(Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task<Expense?> UpdateAsync(Expense expense)
        {
            var existing = await _context.Expenses.FindAsync(expense.Id);
            if (existing == null) return null;

            existing.Name = expense.Name;
            existing.Category = expense.Category;
            existing.Amount = expense.Amount;
            existing.Date = expense.Date;
            existing.Description = expense.Description;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return false;
            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}