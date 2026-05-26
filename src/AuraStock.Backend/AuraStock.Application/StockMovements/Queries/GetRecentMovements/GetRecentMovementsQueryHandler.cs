using MediatR;
using Microsoft.EntityFrameworkCore;
using AuraStock.Application.Interfaces;
using AuraStock.Application.StockMovements.Queries.GetRecentMovements;

namespace AuraStock.Application.StockMovements.Queries;

public class GetProductsWithStockQueryHandler : IRequestHandler<GetRecentMovementsQuery, List<GetRecentMovementDto>>
{
    private readonly IAppDbContext _context;

    public GetProductsWithStockQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GetRecentMovementDto>> Handle(GetRecentMovementsQuery request, CancellationToken cancellationToken)
    {
        var recentMovements = await _context.StockMovements
        .AsNoTracking()
        .OrderByDescending(sm => sm.MovementDate)
        .Take(request.Count)
        .Join(_context.Products,
        movement => movement.ProductId,
        product => product.Id,
        (movement, product) => new GetRecentMovementDto(
            movement.Id,
            product.ProductName,
            movement.Type,
            movement.Quantity,
            movement.MovementDate,
            movement.ReferenceNumber
        ))
        .ToListAsync(cancellationToken);

        return recentMovements;
    }
}