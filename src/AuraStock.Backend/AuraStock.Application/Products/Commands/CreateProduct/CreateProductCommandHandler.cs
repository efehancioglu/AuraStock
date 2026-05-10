using AuraStock.Domain.Entities;
using AuraStock.Application.Interfaces;
using MediatR;

namespace AuraStock.Application.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly IProductRepository _productRepository;

    public CreateProductCommandHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product(
            request.Sku,
            request.Name,
            request.UnitCost,
            request.LeadTimeInDays
        );
        await _productRepository.AddAsync(product);
        return product.Id;
    }
}