using AuraStock.Domain.Enums;

namespace AuraStock.Application.StockMovements.Queries.GetRecentMovements;

public record GetRecentMovementDto
(
    Guid Id,
    string ProductName,
    MovementType Type,
    int Quantity,
    DateTime MovementDate,
    string ReferenceNumber
);