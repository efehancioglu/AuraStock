namespace AuraStock.Application.Dashboard.Queries.GetDashboardSummary;

public record DashboardSummaryDto
(
    int TotalProducts,
    int TotalMovements,
    int TodayMovementsCount,
    int OutOfStockAlerts
);