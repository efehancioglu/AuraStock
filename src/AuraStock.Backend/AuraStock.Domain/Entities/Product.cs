using AuraStock.Domain.Common;

namespace AuraStock.Domain.Entities;

public class Product : BaseEntity
{
    public string ProductSku { get; private set; }
    public string ProductName { get; private set; }
    public decimal UnitCost { get; private set; }
    public int LeadTimeInDays { get; private set; }


    private Product() { }

    public Product(string prSku, string prName, decimal unitCost, int leadTimeInDays)
    {
        Id = Guid.NewGuid();
        ProductSku = prSku;
        ProductName = prName;
        UnitCost = unitCost;
        LeadTimeInDays = leadTimeInDays;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateDetails(string sku, string name, decimal newCost)
    {
        if (newCost < 0)
            throw new ArgumentException("Birim fiyat 0'dan dusuk olamaz.");

        ProductSku = sku;
        ProductName = name;
        UnitCost = newCost;

        LastModifiedAt = DateTime.UtcNow;
    }
}