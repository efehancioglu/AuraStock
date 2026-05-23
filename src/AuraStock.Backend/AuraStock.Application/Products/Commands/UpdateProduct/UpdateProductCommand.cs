using MediatR;
using System;

namespace AuraStock.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Sku { get; set; }
    public string Name { get; set; }
    public decimal UnitCost { get; set; }
}