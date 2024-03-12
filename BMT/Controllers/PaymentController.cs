using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Blazor.Web.UI.Interfaces;
using Blazor.Web.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Blazor.Web.UI.Controllers
{
    public class PaymentController : Controller
    {
        private readonly IPaymentPageService _paymentPageService;
        private readonly IMemoryCache _cache;
        public PaymentController(IPaymentPageService paymentPageService,  IMemoryCache cache)
        {
            _paymentPageService = paymentPageService ?? throw new ArgumentNullException(nameof(paymentPageService));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }
        [HttpPost]
        public async Task<BlazorResponseViewModel> addpament(PaymentViewModel model)
        {          
            BlazorResponseViewModel BlazorResponseViewModel = new BlazorResponseViewModel();
            try
            {
                model.TransactionTime = UTIL.GlobalApp.CurrentDateTime;
                model.Status = (int)Blazor.Web.UTIL.RESPONSE_RESULT.SUCCESS;               

                if (model.CardNumber.Length > 4)
                {
                    model.CardNumber=  string.Concat("".PadLeft(12, '*'), model.CardNumber.Substring(model.CardNumber.Length - 4));                 
                }                 
                await _paymentPageService.CreatePayment(model);

                    // ViewBag.SuccessMessage = string.Format(UTIL.BlazorConstants.UPDATED_SUCCESS, (user.FirstName + " " + user.LastName), System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss"));
                    BlazorResponseViewModel.status = true;
                    BlazorResponseViewModel.message = string.Format(UTIL.BlazorConstants.INSERTED_SUCCESS, (model.FirstName + " " + model.LastName), System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss"));
               
            }
            catch (Exception ex)
            {
                BlazorResponseViewModel.status = false;
                BlazorResponseViewModel.message = string.Format(UTIL.BlazorConstants.INSERTED_FAILED, (model.FirstName + " " + model.LastName), (ex.InnerException == null ? ex.Message : ex.InnerException.Message));
            }
            return BlazorResponseViewModel;


        }
    }
}