using MediatR;

namespace AuraStock.Application.Products.Commands.DeleteProduct;

    public class DeleteProductCommand : IRequest<bool>
    {
        public Guid Id {get; set;}
    }
