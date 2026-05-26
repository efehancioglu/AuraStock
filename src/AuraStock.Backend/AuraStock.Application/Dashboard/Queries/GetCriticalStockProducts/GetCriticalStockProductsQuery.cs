using MediatR;

namespace AuraStock.Application.Dashboard.Queries.GetCriticalStockProducts;

public record GetCriticalStockProductsQuery(int Threshold = 20) : IRequest<List<CriticalStockProductDto>>;