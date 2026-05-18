using MediatR;
using Microsoft.EntityFrameworkCore;
using AuraStock.Domain.Entities;
using AuraStock.Application.Interfaces;
using AuraStock.Domain.Enums;

namespace AuraStock.Application.StockMovements.Commands.AddStockMovement;

public class AddStockMovementCommandHandler : IRequestHandler<AddStockMovementCommand, Guid>
{
    private readonly IAppDbContext _context;
    public AddStockMovementCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(AddStockMovementCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);
        if (product is null)
            throw new Exception("Hata: Belirtilen urun bulunamadi!");

        if (request.MovementType == MovementType.Out)
        {
            var totalIn = await _context.StockMovements
            .Where(sm => sm.ProductId == request.ProductId && sm.Type == MovementType.In)
            .SumAsync(sm => sm.Quantity, cancellationToken);

            var totalOut = await _context.StockMovements
            .Where(sm => sm.ProductId == request.ProductId && sm.Type == MovementType.Out)
            .SumAsync(sm => sm.Quantity, cancellationToken);

            var currentStock = totalIn - totalOut;

            if (currentStock < request.Quantity)
                throw new Exception($"Yetersiz Stok.");
        }

        var stockMovement = new StockMovement
        (
            request.ProductId,
            request.MovementType,
            request.Quantity,
            request.ReferenceNumber
        );

        _context.StockMovements.Add(stockMovement);
        await _context.SaveChangesAsync(cancellationToken);

        return stockMovement.Id;
    }

}