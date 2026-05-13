using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelPlanService.Interfaces;
using TravelPlanService.Models;

namespace TravelPlanService.Repository
{
    public class ChecklistItemRepository : IChecklistItemRepository
    {
        private readonly TravelPlanDbContext _context;

        public ChecklistItemRepository(TravelPlanDbContext context)
        {
            _context = context;
        }

        public async Task<List<ChecklistItem>> GetForPlanAsync(long travelPlanId)
        {
            return await _context.ChecklistItems
                .AsNoTracking()
                .Where(c => c.TravelPlanId == travelPlanId)
                .OrderBy(c => c.Id)
                .ToListAsync();
        }

        public async Task<ChecklistItem?> GetByIdAsync(long id)
        {
            return await _context.ChecklistItems.FindAsync(id);
        }

        public async Task<ChecklistItem> CreateAsync(ChecklistItem item)
        {
            _context.ChecklistItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<ChecklistItem?> UpdateAsync(ChecklistItem item)
        {
            var existing = await _context.ChecklistItems.FindAsync(item.Id);
            if (existing == null) return null;

            existing.Text = item.Text;
            existing.Completed = item.Completed;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var item = await _context.ChecklistItems.FindAsync(id);
            if (item == null) return false;
            _context.ChecklistItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}