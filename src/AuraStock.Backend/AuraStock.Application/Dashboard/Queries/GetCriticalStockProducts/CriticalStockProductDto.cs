namespace AuraStock.Application.Dashboard.Queries.GetCriticalStockProducts;

public record CriticalStockProductDto
(
    Guid Id,
    string Sku,
    string Name,
    int CurrentStock
);