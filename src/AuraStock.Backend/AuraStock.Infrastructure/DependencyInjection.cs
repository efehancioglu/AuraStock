using AuraStock.Application.Interfaces;
using AuraStock.Infrastructure.Persistence;
using AuraStock.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using AuraStock.Application.Interfaces;

namespace AuraStock.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));

        services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());
        services.AddScoped<IProductRepository, ProductRepository>();

        return services;
    }
}