namespace AuraStock.Application.Dashboard.Queries.GetTopSellingProducts;

public record TopSellingProductDto
(
    string ProductName,
    int TotalSold
);