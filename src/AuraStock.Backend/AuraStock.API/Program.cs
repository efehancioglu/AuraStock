using AuraStock.Infrastructure;
using AuraStock.Application.Products.Commands.CreateProduct;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure("Server=(localdb)\\mssqllocaldb;Database=AuraStockDb;Trusted_Connection=True;TrustServerCertificate=True;");
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(typeof(CreateProductCommand).Assembly));

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
