using System.Net;
using System.Text.Json;
using AuraStock.Application.Common.Exceptions;

namespace AuraStock.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Bir hata olustu: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var statusCode = (int)HttpStatusCode.InternalServerError;
        var message = exception.Message;

        if (exception is ArgumentException)
        {
            statusCode = (int)HttpStatusCode.BadRequest;
        }

        else if (message.Contains("Yetersiz Stok") || message.Contains("bulunamadi"))
        {
            statusCode = (int)HttpStatusCode.BadRequest;
        }

        context.Response.StatusCode = statusCode;

        var response = new ErrorResponse(statusCode, message);

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        return context.Response.WriteAsync(jsonResponse);
    }
}