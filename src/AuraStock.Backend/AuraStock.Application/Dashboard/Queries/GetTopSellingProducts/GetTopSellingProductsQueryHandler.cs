using MediatR;
using Microsoft.EntityFrameworkCore;
using AuraStock.Application.Interfaces;
using AuraStock.Domain.Enums;

namespace AuraStock.Application.Dashboard.Queries.GetTopSellingProducts;

public class GetTopSellingProductsQueryHandler : IRequestHandler<GetTopSellingProductsQuery, List<TopSellingProductDto>>
{
    private readonly IAppDbContext _context;

    public GetTopSellingProductsQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TopSellingProductDto>> Handle(GetTopSellingProductsQuery request, CancellationToken cancellationToken)
    {
        var topSellers = await _context.StockMovements
        .AsNoTracking()
        .Where(sm => sm.Type == MovementType.Out)
        .GroupBy(sm => sm.ProductId)
        .Select(g => new
        {
            ProductId = g.Key,
            TotalSold = g.Sum(sm => sm.Quantity)
        })
        .OrderByDescending(x => x.TotalSold)
        .Take(request.Count)
        .Join(_context.Products,
            movementGroup => movementGroup.ProductId,
            product => product.Id,
            (movementGroup, product) => new TopSellingProductDto(
                product.ProductName,
                movementGroup.TotalSold
            ))
            .ToListAsync(cancellationToken);

        return topSellers;
    }
}