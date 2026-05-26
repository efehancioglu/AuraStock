using MediatR;
using Microsoft.EntityFrameworkCore;
using AuraStock.Application.Interfaces;
using AuraStock.Domain.Enums;

namespace AuraStock.Application.Dashboard.Queries.GetCriticalStockProducts;

public class GetCriticalStockProductsQueryHandler : IRequestHandler<GetCriticalStockProductsQuery, List<CriticalStockProductDto>>
{
    private readonly IAppDbContext _context;

    public GetCriticalStockProductsQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CriticalStockProductDto>> Handle(GetCriticalStockProductsQuery request, CancellationToken cancellationToken)
    {
        var productWithStock = await _context.Products
        .AsNoTracking()
        .Select(p => new CriticalStockProductDto(
            p.Id,
            p.ProductSku,
            p.ProductName,
            (_context.StockMovements
            .Where(sm => sm.ProductId == p.Id && sm.Type == MovementType.In)
            .Sum(sm => (int?)sm.Quantity) ?? 0) -
            (_context.StockMovements
            .Where(sm => sm.ProductId == p.Id && sm.Type == MovementType.Out)
            .Sum(sm => (int?)sm.Quantity) ?? 0)
        ))
        .ToListAsync(cancellationToken);

        var criticalProducts = productWithStock
        .Where(p => p.CurrentStock <= request.Threshold)
        .OrderBy(p => p.CurrentStock)
        .ToList();

        return criticalProducts;
    }
}