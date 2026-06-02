namespace AuraStock.Application.Dashboard.Queries.GetDailyMovementStats;

public record DailyMovementStatsDto
(
    string Date,
    int InAmount,
    int OutAmount
);