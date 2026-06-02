using AuraStock.Application.Dashboard.Queries.GetDailyMovementStats;
using MediatR;

namespace AuraStock.Application.Dashboard.Queries.GetDailyMovementStats;

public record GetDailyMovementStatsQuery : IRequest<List<DailyMovementStatsDto>>;