using AuraStock.Infrastructure;
using AuraStock.Application.Products.Commands.CreateProduct;
using AuraStock.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure("Server=(localdb)\\mssqllocaldb;Database=AuraStockDb;Trusted_Connection=True;TrustServerCertificate=True;");
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(typeof(CreateProductCommand).Assembly));

builder.Services.AddControllers();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


app.UseHttpsRedirection();

app.MapControllers();

app.Run();
