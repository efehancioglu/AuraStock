using Microsoft.AspNetCore.Mvc;
using MediatR;
using AuraStock.Application.Dashboard.Queries.GetDashboardSummary;

namespace AuraStock.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var query = new GetDashboardSummaryQuery();
        var result = await _mediator.Send(query);

        return Ok(result);
    }

}
