using AuraStock.Domain.Enums;
using MediatR;

namespace AuraStock.Application.StockMovements.Commands.AddStockMovement;

public record AddStockMovementCommand
(
    Guid ProductId,
    int Quantity,
    MovementType MovementType,
    string ReferenceNumber,
    string? Note
) : IRequest<Guid>;