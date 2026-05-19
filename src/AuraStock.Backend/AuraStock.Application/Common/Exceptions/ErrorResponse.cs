namespace AuraStock.Application.Common.Exceptions;

public record ErrorResponse
(
    int StatusCode,
    string Message,
    string? Details = null
);