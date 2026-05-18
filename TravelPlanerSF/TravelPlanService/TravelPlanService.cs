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
using TravelPlanService.Interfaces;
using TravelPlanService.Repository;
using TravelPlanService.Services;

namespace TravelPlanService
{
    // Stateless ASP.NET Core service: travel plans, destinations, activities, expenses, checklist, and sharing.
    internal sealed class TravelPlanService : StatelessService
    {
        public TravelPlanService(StatelessServiceContext context)
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
                        builder.Services.AddDbContext<TravelPlanDbContext>(options =>
                            options.UseSqlServer(connectionString));

                        // JWT validation (token issued by AuthService)
                        var jwtSecret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret missing.");
                        var jwtIssuer = configuration["Jwt:Issuer"] ?? "TravelPlanerSF";
                        var jwtAudience = configuration["Jwt:Audience"] ?? "TravelPlanerSF";

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

                        // CORS — allow frontend
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

                        // Repositories
                        builder.Services.AddScoped<ITravelPlanRepository, TravelPlanRepository>();
                        builder.Services.AddScoped<IDestinationRepository, DestinationRepository>();
                        builder.Services.AddScoped<IActivityRepository, ActivityRepository>();
                        builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
                        builder.Services.AddScoped<IChecklistItemRepository, ChecklistItemRepository>();

                        // Business services
                        builder.Services.AddScoped<ITravelPlansService, TravelPlansBusinessService>();
                        builder.Services.AddScoped<IDestinationService, DestinationsBusinessService>();
                        builder.Services.AddScoped<IActivitiesService, ActivitiesBusinessService>();
                        builder.Services.AddScoped<IExpensesService, ExpensesBusinessService>();
                        builder.Services.AddScoped<IChecklistItemsService, ChecklistItemsBusinessService>();
                        builder.Services.AddScoped<ISharingService, SharingBusinessService>();

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

                        // Auto-migrate on startup
                        using (var scope = app.Services.CreateScope())
                        {
                            try
                            {
                                var db = scope.ServiceProvider.GetRequiredService<TravelPlanDbContext>();
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