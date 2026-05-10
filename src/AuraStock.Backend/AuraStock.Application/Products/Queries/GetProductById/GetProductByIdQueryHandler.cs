using MediatR;
using AuraStock.Application.Products.Dtos;
using AuraStock.Application.Interfaces;
using AuraStock.Domain.Entities;

namespace AuraStock.Application.Products.Queries.GetProductById;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly IProductRepository _productRepository;

    public GetProductByIdQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id);
        if (product is null)
            return null;

        return new ProductDto(
            product.Id,
            product.ProductSku,
            product.ProductName,
            product.UnitCost,
            product.LeadTimeInDays
        );
    }
}