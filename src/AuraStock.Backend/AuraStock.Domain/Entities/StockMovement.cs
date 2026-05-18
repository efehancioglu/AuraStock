using AuraStock.Domain.Common;
using AuraStock.Domain.Enums;

namespace AuraStock.Domain.Entities;

public class StockMovement : BaseEntity
{
    public Guid ProductId { get; set; }
    public MovementType Type { get; set; }
    public int Quantity { get; set; }
    public DateTime MovementDate { get; set; }
    public string ReferenceNumber { get; set; }

    private StockMovement() { }

    public StockMovement(Guid productId, MovementType type, int quantity, string referenceNumber)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be greater than zero. ");

        Id = Guid.NewGuid();
        ProductId = productId;
        Type = type;
        Quantity = quantity;
        ReferenceNumber = referenceNumber;
        MovementDate = DateTime.UtcNow;
        CreatedAt = DateTime.UtcNow;
    }
}