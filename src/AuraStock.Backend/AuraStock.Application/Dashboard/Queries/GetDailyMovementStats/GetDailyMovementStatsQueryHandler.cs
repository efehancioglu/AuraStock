using MediatR;
using Microsoft.EntityFrameworkCore;
using AuraStock.Application.Interfaces;
using AuraStock.Domain.Enums;
using AuraStock.Application.Dashboard.Queries.GetDailyMovementStats;


namespace AuraStock.Application.Dashboard.Queries.GetDailyMovementStats;

public class GetDailyMovementStatsQueryHandler : IRequestHandler<GetDailyMovementStatsQuery, List<DailyMovementStatsDto>>
{
    private readonly IAppDbContext _context;

    public GetDailyMovementStatsQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<DailyMovementStatsDto>> Handle(GetDailyMovementStatsQuery request, CancellationToken cancellationToken)
    {
        var startDate = DateTime.UtcNow.Date.AddDays(-6);

        var recentMovements = await _context.StockMovements
        .AsNoTracking()
        .Where(sm => sm.MovementDate >= startDate)
        .ToListAsync(cancellationToken);

        var stats = new List<DailyMovementStatsDto>();

        for (int i = 0; i < 7; i++)
        {
            var currentDate = startDate.AddDays(i);

            var dayMovements = recentMovements.Where(sm => sm.MovementDate.Date == currentDate).ToList();

            var totalIn = dayMovements.Where(sm => sm.Type == MovementType.In).Sum(sm => sm.Quantity);
            var totalOut = dayMovements.Where(sm => sm.Type == MovementType.Out).Sum(sm => sm.Quantity);

            stats.Add(new DailyMovementStatsDto(currentDate.ToString("dd MMM"), totalIn, totalOut));


        }

        return stats;
    }
}