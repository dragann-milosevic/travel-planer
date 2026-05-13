using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelPlanService.Interfaces;
using TravelPlanService.Models;

namespace TravelPlanService.Repository
{
    public class DestinationRepository : IDestinationRepository
    {
        private readonly TravelPlanDbContext _context;

        public DestinationRepository(TravelPlanDbContext context)
        {
            _context = context;
        }

        public async Task<List<Destination>> GetForPlanAsync(long travelPlanId)
        {
            return await _context.Destinations
                .AsNoTracking()
                .Where(d => d.TravelPlanId == travelPlanId)
                .OrderBy(d => d.ArrivalDate)
                .ToListAsync();
        }

        public async Task<Destination?> GetByIdAsync(long id)
        {
            return await _context.Destinations.FindAsync(id);
        }

        public async Task<Destination> CreateAsync(Destination destination)
        {
            _context.Destinations.Add(destination);
            await _context.SaveChangesAsync();
            return destination;
        }

        public async Task<Destination?> UpdateAsync(Destination destination)
        {
            var existing = await _context.Destinations.FindAsync(destination.Id);
            if (existing == null) return null;

            existing.Name = destination.Name;
            existing.Location = destination.Location;
            existing.ArrivalDate = destination.ArrivalDate;
            existing.DepartureDate = destination.DepartureDate;
            existing.Description = destination.Description;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var destination = await _context.Destinations.FindAsync(id);
            if (destination == null) return false;
            _context.Destinations.Remove(destination);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}