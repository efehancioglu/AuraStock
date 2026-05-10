using MediatR;

namespace AuraStock.Application.Products.Commands.CreateProduct;

public record CreateProductCommand(
    string Sku,
    string Name,
    decimal UnitCost,
    int LeadTimeInDays
) : IRequest<Guid>;