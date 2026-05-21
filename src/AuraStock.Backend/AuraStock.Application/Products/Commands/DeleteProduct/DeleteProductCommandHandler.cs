using MediatR;
using Microsoft.EntityFrameworkCore;
using AuraStock.Domain.Entities;
using AuraStock.Application.Interfaces;

namespace AuraStock.Application.Products.Commands.DeleteProduct;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IAppDbContext _context;
    public DeleteProductCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products.FindAsync(new object[] { request.Id }, cancellationToken);

        if (product is null)
        {
            throw new Exception("Silinmek istenen urun bulunamadi");
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}

