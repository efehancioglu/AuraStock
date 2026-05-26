using MediatR;
using Microsoft.EntityFrameworkCore;
using AuraStock.Application.Interfaces;

namespace AuraStock.Application.Dashboard.Queries.GetDashboardSummary;

public class GetDashboardSummaryQueryHandler : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
{
    public readonly IAppDbContext _context;

    public GetDashboardSummaryQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardSummaryDto> Handle(GetDashboardSummaryQuery request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;

        var totalProducts = await _context.Products.CountAsync(cancellationToken);

        var totalMovements = await _context.StockMovements.CountAsync(cancellationToken);

        var todayMovementsCount = await _context.StockMovements
        .Where(sm => sm.MovementDate.Date == today)
        .CountAsync(cancellationToken);

        var outOfStockAlerts = 0;

        return new DashboardSummaryDto(
            totalProducts,
            totalMovements,
            todayMovementsCount,
            outOfStockAlerts
        );
    }
}