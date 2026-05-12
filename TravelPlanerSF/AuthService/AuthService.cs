using System;
using System.Collections.Generic;
using System.Fabric;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using AuthService.Interfaces;
using AuthService.Repository;
using AuthService.Services;
using AuthService.Utils;

namespace AuthService
{
    /// <summary>
    /// Stateless ASP.NET Core service hosted in Service Fabric.
    /// Handles authentication (login, register) and user management (admin).
    /// </summary>
    internal sealed class AuthService : StatelessService
    {
        public AuthService(StatelessServiceContext context)
            : base(context)
        { }

        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new ServiceInstanceListener[]
            {
                new ServiceInstanceListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                    {
                        ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

                        var builder = WebApplication.CreateBuilder();

                        builder.Configuration
                            .SetBasePath(Directory.GetCurrentDirectory())
                            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                            .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
                            .AddEnvironmentVariables();

                        var configuration = builder.Configuration;

                        builder.Services.AddSingleton<StatelessServiceContext>(serviceContext);

                        // Database
                        var connectionString = configuration.GetConnectionString("DefaultConnection")
                                                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
                        builder.Services.AddDbContext<AuthDbContext>(options =>
                            options.UseSqlServer(connectionString));

                        // JWT settings
                        var jwtSecret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret missing.");
                        var jwtIssuer = configuration["Jwt:Issuer"] ?? "TravelPlanerSF";
                        var jwtAudience = configuration["Jwt:Audience"] ?? "TravelPlanerSF";
                        var jwtExpiryHours = int.TryParse(configuration["Jwt:ExpiryHours"], out var h) ? h : 24;

                        builder.Services.AddSingleton(new TokenGenerator(jwtSecret, jwtIssuer, jwtAudience, jwtExpiryHours));

                        // Authentication
                        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                            .AddJwtBearer(options =>
                            {
                                options.RequireHttpsMetadata = false;
                                options.SaveToken = true;
                                options.TokenValidationParameters = new TokenValidationParameters
                                {
                                    ValidateIssuer = true,
                                    ValidateAudience = true,
                                    ValidateLifetime = true,
                                    ValidateIssuerSigningKey = true,
                                    ValidIssuer = jwtIssuer,
                                    ValidAudience = jwtAudience,
                                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                                    ClockSkew = TimeSpan.FromMinutes(1)
                                };
                            });
                        builder.Services.AddAuthorization();

                        // CORS — allow frontend (React dev server)
                        builder.Services.AddCors(options =>
                        {
                            options.AddDefaultPolicy(policy =>
                                policy.WithOrigins(
                                            "http://localhost:3000",
                                            "http://127.0.0.1:3000")
                                      .AllowAnyHeader()
                                      .AllowAnyMethod()
                                      .AllowCredentials());
                        });

                        // Repositories + Services
                        builder.Services.AddScoped<IUserRepository, UserRepository>();
                        builder.Services.AddScoped<IAuthService, AuthBusinessService>();
                        builder.Services.AddScoped<IUserService, UserBusinessService>();

                        // Controllers + Swagger
                        builder.Services.AddControllers();
                        builder.Services.AddEndpointsApiExplorer();
                        builder.Services.AddSwaggerGen();

                        builder.WebHost
                            .UseKestrel()
                            .UseContentRoot(Directory.GetCurrentDirectory())
                            .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                            .UseUrls(url);

                        var app = builder.Build();

                        // Auto-migrate on startup so tables exist before first request
                        using (var scope = app.Services.CreateScope())
                        {
                            try
                            {
                                var db = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
                                db.Database.Migrate();
                            }
                            catch (Exception ex)
                            {
                                ServiceEventSource.Current.ServiceMessage(serviceContext,
                                    $"Database migration failed: {ex.Message}");
                            }
                        }

                        if (app.Environment.IsDevelopment())
                        {
                            app.UseSwagger();
                            app.UseSwaggerUI();
                        }

                        app.UseCors();
                        app.UseAuthentication();
                        app.UseAuthorization();
                        app.MapControllers();

                        return app;
                    }))
            };
        }
    }
}