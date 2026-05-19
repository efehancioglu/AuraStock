using Microsoft.AspNetCore.Mvc;
using MediatR;
using AuraStock.Application.Products.Commands.CreateProduct;
using AuraStock.Application.Products.Queries.GetProductById;
using AuraStock.Application.Products.Queries.GetProductWithStock;

namespace AuraStock.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand command)
    {
        var productId = await _mediator.Send(command);

        return CreatedAtAction(nameof(GetProduct), new { id = productId }, new { Id = productId, Message = "Ürün başarıyla oluşturuldu." });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProduct(Guid id)
    {
        var query = new GetProductByIdQuery(id);
        var product = await _mediator.Send(query);

        if (product is null)
            return NotFound(new { Message = "Aradiginiz urun bulunamadi." });

        return Ok(product);
    }

    [HttpGet("with-stock")]
    public async Task<IActionResult> GetProductsWithStock()
    {
        var query = new GetProductsWithStockQuery();
        var result = await _mediator.Send(query);

        return Ok(result);
    }
}