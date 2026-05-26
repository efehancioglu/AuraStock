using Microsoft.AspNetCore.Mvc;
using MediatR;
using AuraStock.Application.StockMovements.Commands.AddStockMovement;
using AuraStock.Application.StockMovements.Queries.GetRecentMovements;

namespace AuraStock.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockMovementsController : ControllerBase
{
    private readonly IMediator _mediator;

    public StockMovementsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> AddMovement([FromBody] AddStockMovementCommand command)
    {
        var movementId = await _mediator.Send(command);

        return Ok(new { Id = movementId, Message = "Stok hareketi basariyla islendi" });
    }

    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentMovements([FromQuery] int count = 5)
    {
        var query = new GetRecentMovementsQuery(count);
        var result = await _mediator.Send(query);

        return Ok(result);
    }

}