using MediatR;
using AuraStock.Application.Products.Dtos;

namespace AuraStock.Application.Products.Queries.GetProductWithStock;

public record GetProductsWithStockQuery() : IRequest<List<ProductWithStockDto>>;