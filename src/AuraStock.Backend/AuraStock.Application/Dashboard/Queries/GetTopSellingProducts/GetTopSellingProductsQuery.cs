using MediatR;


namespace AuraStock.Application.Dashboard.Queries.GetTopSellingProducts;

public record GetTopSellingProductsQuery(int Count = 5) : IRequest<List<TopSellingProductDto>>;