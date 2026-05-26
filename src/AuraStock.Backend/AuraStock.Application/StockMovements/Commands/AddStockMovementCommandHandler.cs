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
        // 1. Ürün veritabanında gerçekten var mı?
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);
        if (product is null)
            throw new Exception("Hata: Belirtilen ürün bulunamadı!");

        // 2. Çıkış İşlemi (Sevkıyat) Güvenlik Duvarı
        if (request.MovementType == MovementType.Out)
        {
            // EF Core bazen Enum'ları SQL'de yanlış toplayabilir. 
            // En garantili yöntem: O ürüne ait tüm hareketleri çekip, matematiği %100 güvenli şekilde C#'a yaptırmak.
            var pastMovements = await _context.StockMovements
                .Where(sm => sm.ProductId == request.ProductId)
                .ToListAsync(cancellationToken);

            int totalIn = pastMovements.Where(sm => sm.Type == MovementType.In).Sum(sm => sm.Quantity);
            int totalOut = pastMovements.Where(sm => sm.Type == MovementType.Out).Sum(sm => sm.Quantity);

            int currentStock = totalIn - totalOut;

            // Eğer hesaplanan gerçek stok, çıkarmak istenen miktardan azsa işlemi durdur ve detayı göster!
            if (currentStock < request.Quantity)
            {
                throw new Exception($"İşlem Reddedildi! Veritabanındaki Gerçek Stok: {currentStock} (Toplam Giren: {totalIn}, Toplam Çıkan: {totalOut}). Senin Çıkarmak İstediğin: {request.Quantity}");
            }
        }

        // 3. Her şey yolundaysa yeni stok hareketini oluştur
        var stockMovement = new StockMovement
        (
            request.ProductId,
            request.MovementType,
            request.Quantity,
            request.ReferenceNumber
        );

        // 4. Veritabanına kaydet
        _context.StockMovements.Add(stockMovement);
        await _context.SaveChangesAsync(cancellationToken);

        return stockMovement.Id;
    }
}