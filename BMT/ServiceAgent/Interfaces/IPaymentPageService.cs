using Blazor.Web.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.UI.Interfaces
{
    public interface IPaymentPageService
    {
        Task<IEnumerable<PaymentViewModel>> GetPaymentsList(string cCard, string email);
        Task<PaymentViewModel> GetPaymentById(long paymentId);       
        Task<IEnumerable<PaymentViewModel>> GetPaymentsListByFiltersAsync(PaymentViewModel model);        
        Task<PaymentViewModel> CreatePayment(PaymentViewModel PaymentViewModel);               
        Task UpdatePayment(PaymentViewModel PaymentViewModel);      
    }
}
