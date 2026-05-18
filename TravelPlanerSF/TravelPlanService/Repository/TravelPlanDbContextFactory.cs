using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TravelPlanService.Repository
{
    // Design-time factory used by 'dotnet ef' CLI; runtime DbContext is registered in TravelPlanService.cs.
    public class TravelPlanDbContextFactory : IDesignTimeDbContextFactory<TravelPlanDbContext>
    {
        public TravelPlanDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection")
                                    ?? "Server=localhost\\SQLEXPRESS;Database=TravelPlanerCore;Trusted_Connection=True;TrustServerCertificate=True";

            var builder = new DbContextOptionsBuilder<TravelPlanDbContext>();
            builder.UseSqlServer(connectionString);

            return new TravelPlanDbContext(builder.Options);
        }
    }
}