using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelPlanService.Interfaces;
using TravelPlanService.Models;

namespace TravelPlanService.Repository
{
    public class ActivityRepository : IActivityRepository
    {
        private readonly TravelPlanDbContext _context;

        public ActivityRepository(TravelPlanDbContext context)
        {
            _context = context;
        }

        public async Task<List<Activity>> GetForPlanAsync(long travelPlanId)
        {
            return await _context.Activities
                .AsNoTracking()
                .Where(a => a.TravelPlanId == travelPlanId)
                .OrderBy(a => a.Date).ThenBy(a => a.Time)
                .ToListAsync();
        }

        public async Task<Activity?> GetByIdAsync(long id)
        {
            return await _context.Activities.FindAsync(id);
        }

        public async Task<Activity> CreateAsync(Activity activity)
        {
            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();
            return activity;
        }

        public async Task<Activity?> UpdateAsync(Activity activity)
        {
            var existing = await _context.Activities.FindAsync(activity.Id);
            if (existing == null) return null;

            existing.Name = activity.Name;
            existing.Date = activity.Date;
            existing.Time = activity.Time;
            existing.Location = activity.Location;
            existing.Description = activity.Description;
            existing.EstimatedCost = activity.EstimatedCost;
            existing.Status = activity.Status;
            existing.DestinationId = activity.DestinationId;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var activity = await _context.Activities.FindAsync(id);
            if (activity == null) return false;
            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}