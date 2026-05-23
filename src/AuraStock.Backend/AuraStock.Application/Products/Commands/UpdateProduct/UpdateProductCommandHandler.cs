using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using AuraStock.Domain.Entities;
using AuraStock.Application.Interfaces;

namespace AuraStock.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, bool>
{
    private readonly IAppDbContext _context;

    public UpdateProductCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products.FindAsync(new object[] { request.Id }, cancellationToken);

        if (product == null)
        {
            throw new Exception("Guncellenmek istenen urun bulunamadi.");
        }

        product.UpdateDetails(request.Sku, request.Name, request.UnitCost);

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}