using MediatR;
using Microsoft.EntityFrameworkCore;
using AuraStock.Application.Interfaces;
using AuraStock.Application.Products.Dtos;
using AuraStock.Domain.Enums;

namespace AuraStock.Application.Products.Queries.GetProductWithStock;

public class GetProductsWithStockQueryHandler : IRequestHandler<GetProductsWithStockQuery, List<ProductWithStockDto>>
{
    private readonly IAppDbContext _context;

    public GetProductsWithStockQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductWithStockDto>> Handle(GetProductsWithStockQuery request, CancellationToken cancellationToken)
    {
        var products = await _context.Products
        .AsNoTracking()
        .Select(p => new ProductWithStockDto(
            p.Id,
            p.ProductSku,
            p.ProductName,
            p.UnitCost,
            _context.StockMovements
            .Where(sm => sm.ProductId == p.Id && sm.Type == MovementType.In)
            .Sum(sm => (int?)sm.Quantity) ?? 0
            -
             _context.StockMovements
            .Where(sm => sm.ProductId == p.Id && sm.Type == MovementType.Out)
            .Sum(sm => (int?)sm.Quantity) ?? 0
        )).ToListAsync(cancellationToken);

        return products;
    }
}