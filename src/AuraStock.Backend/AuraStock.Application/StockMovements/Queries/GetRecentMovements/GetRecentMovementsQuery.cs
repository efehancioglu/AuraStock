using MediatR;

namespace AuraStock.Application.StockMovements.Queries.GetRecentMovements;

public record GetRecentMovementsQuery(int Count = 5) : IRequest<List<GetRecentMovementDto>>;