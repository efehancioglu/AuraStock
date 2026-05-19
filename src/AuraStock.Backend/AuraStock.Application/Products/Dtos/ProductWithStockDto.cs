namespace AuraStock.Application.Products.Dtos;

public record ProductWithStockDto
(
    Guid Id,
    string Sku,
    string Name,
    decimal UnitCost,
    int CurrentStock
);