using Microsoft.EntityFrameworkCore;
using TravelPlanService.Models;

namespace TravelPlanService.Repository
{
    public class TravelPlanDbContext : DbContext
    {
        public TravelPlanDbContext(DbContextOptions<TravelPlanDbContext> options) : base(options) { }

        public DbSet<TravelPlan> TravelPlans { get; set; } = null!;
        public DbSet<Destination> Destinations { get; set; } = null!;
        public DbSet<Activity> Activities { get; set; } = null!;
        public DbSet<Expense> Expenses { get; set; } = null!;
        public DbSet<ChecklistItem> ChecklistItems { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Decimal precision
            modelBuilder.Entity<TravelPlan>()
                .Property(p => p.Budget)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Activity>()
                .Property(a => a.EstimatedCost)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Expense>()
                .Property(e => e.Amount)
                .HasPrecision(18, 2);

            // Cascading delete: deleting TravelPlan removes all related entities
            modelBuilder.Entity<TravelPlan>()
                .HasMany(p => p.Destinations)
                .WithOne(d => d.TravelPlan!)
                .HasForeignKey(d => d.TravelPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TravelPlan>()
                .HasMany(p => p.Activities)
                .WithOne(a => a.TravelPlan!)
                .HasForeignKey(a => a.TravelPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TravelPlan>()
                .HasMany(p => p.Expenses)
                .WithOne(e => e.TravelPlan!)
                .HasForeignKey(e => e.TravelPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TravelPlan>()
                .HasMany(p => p.ChecklistItems)
                .WithOne(c => c.TravelPlan!)
                .HasForeignKey(c => c.TravelPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            // Activity → Destination (optional FK, set null on delete)
            modelBuilder.Entity<Activity>()
                .HasOne(a => a.Destination)
                .WithMany()
                .HasForeignKey(a => a.DestinationId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}