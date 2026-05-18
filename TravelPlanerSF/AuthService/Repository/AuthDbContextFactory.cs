using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace AuthService.Repository
{
    // Design-time factory used by 'dotnet ef' CLI; runtime DbContext is registered in AuthService.cs.
    public class AuthDbContextFactory : IDesignTimeDbContextFactory<AuthDbContext>
    {
        public AuthDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection")
                                    ?? "Server=localhost\\SQLEXPRESS;Database=TravelPlanerAuth;Trusted_Connection=True;TrustServerCertificate=True";

            var builder = new DbContextOptionsBuilder<AuthDbContext>();
            builder.UseSqlServer(connectionString);

            return new AuthDbContext(builder.Options);
        }
    }
}
