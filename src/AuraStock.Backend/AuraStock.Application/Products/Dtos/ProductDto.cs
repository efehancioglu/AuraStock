namespace AuraStock.Application.Products.Dtos;

public record ProductDto(
    Guid Id,
    string Sku,
    string Name,
    decimal UnitCost,
    int LeadTimeInDays
);