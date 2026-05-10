using MediatR;
using AuraStock.Application.Products.Dtos;

namespace AuraStock.Application.Products.Queries.GetProductById;

public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto?>;