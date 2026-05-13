using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelPlanService.Interfaces;
using TravelPlanService.Models;

namespace TravelPlanService.Repository
{
    public class TravelPlanRepository : ITravelPlanRepository
    {
        private readonly TravelPlanDbContext _context;

        public TravelPlanRepository(TravelPlanDbContext context)
        {
            _context = context;
        }

        public async Task<List<TravelPlan>> GetAllAsync()
        {
            return await _context.TravelPlans.AsNoTracking().ToListAsync();
        }

        public async Task<List<TravelPlan>> GetAllForOwnerAsync(long ownerId)
        {
            return await _context.TravelPlans
                .AsNoTracking()
                .Where(p => p.OwnerId == ownerId)
                .OrderByDescending(p => p.StartDate)
                .ToListAsync();
        }

        public async Task<TravelPlan?> GetByIdAsync(long id)
        {
            return await _context.TravelPlans.FindAsync(id);
        }

        public async Task<TravelPlan?> GetByIdWithDetailsAsync(long id)
        {
            return await _context.TravelPlans
                .Include(p => p.Destinations)
                .Include(p => p.Activities)
                .Include(p => p.Expenses)
                .Include(p => p.ChecklistItems)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<TravelPlan> CreateAsync(TravelPlan plan)
        {
            _context.TravelPlans.Add(plan);
            await _context.SaveChangesAsync();
            return plan;
        }

        public async Task<TravelPlan?> UpdateAsync(TravelPlan plan)
        {
            var existing = await _context.TravelPlans.FindAsync(plan.Id);
            if (existing == null) return null;

            existing.Name = plan.Name;
            existing.Description = plan.Description;
            existing.StartDate = plan.StartDate;
            existing.EndDate = plan.EndDate;
            existing.Budget = plan.Budget;
            existing.Notes = plan.Notes;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var plan = await _context.TravelPlans.FindAsync(id);
            if (plan == null) return false;
            _context.TravelPlans.Remove(plan);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}