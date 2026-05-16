using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace AuthService.Repository
{
    /// <summary>
    /// Used by EF Core CLI tools (dotnet ef migrations / database update) at design time.
    /// Runtime DbContext registration happens in AuthService.cs inside the Service Fabric host.
    /// </summary>
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
