using Microsoft.EntityFrameworkCore;
using AuraStock.Domain.Entities;

namespace AuraStock.Application.Interfaces;

public interface IAppDbContext
{
    DbSet<Product> Products { get; }
    DbSet<StockMovement> StockMovements { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}