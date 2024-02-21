using Blazor.Web.Application.Interfaces;
using Blazor.Web.Application.Models;
using Blazor.Web.UI.Interfaces;
using Blazor.Web.ViewModels;
// Microsoft Namespaces
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.UI.Services
{
    public class PaymentPageService : IPaymentPageService
    {
        private readonly IPaymentService _paymentService;       
        private readonly IMapper _mapper;
        private readonly ILogger<PaymentPageService> _logger;

        public PaymentPageService(IPaymentService paymentService, IMapper mapper, ILogger<PaymentPageService> logger)
        {
            _paymentService = paymentService ?? throw new ArgumentNullException(nameof(paymentService));       
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }       
        public async Task<IEnumerable<PaymentViewModel>> GetPaymentsList(string cCard, string email)
        {
            var lst = await _paymentService.GetPaymentbyCreditCardAndEmailList(""+cCard, ""+email);
            var mappedByName = _mapper.Map<IEnumerable<PaymentViewModel>>(lst);
            return mappedByName;
        }
       
        public async Task<PaymentViewModel> GetPaymentById(long paymentId)
        {
            var entity = await _paymentService.GetPaymentById(paymentId);
            var mappedByName = _mapper.Map<PaymentViewModel>(entity);      
            return mappedByName;
        }
        
        public async Task<IEnumerable<PaymentViewModel>> GetPaymentsListByFiltersAsync(PaymentViewModel model)
        {
            var mapped = _mapper.Map<PaymentModel>(model);
            var lst = await _paymentService.GetPaymentsbyMultiParametersList(mapped);//.GetPaymentInfoBySubscriberAndDateAsync(subscriberId, dtFrom, dtTo);
            var mappedList = _mapper.Map<IEnumerable<PaymentViewModel>>(lst);           
            return mappedList;
        }
       
       

        public async Task<PaymentViewModel> CreatePayment(PaymentViewModel PaymentViewModel)
        {
            var mapped = _mapper.Map<PaymentModel>(PaymentViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");           
            var entityDto = await _paymentService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - PaymentPageService");

            var mappedViewModel = _mapper.Map<PaymentViewModel>(entityDto);
            return mappedViewModel;
        }
      
       

        public async Task UpdatePayment(PaymentViewModel PaymentViewModel)
        {
            var mapped = _mapper.Map<PaymentModel>(PaymentViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _paymentService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - PaymentPageService");
        }

        //public async Task Delete(PaymentViewModel PaymentViewModel)
        //{
        //    var mapped = _mapper.Map<PaymentModel>(PaymentViewModel);
        //    if (mapped == null)
        //        throw new Exception($"Entity could not be mapped.");

        //    await _paymentAppService.Delete(mapped);
        //    _logger.LogInformation($"Entity successfully added - AuthorsPageService");
        //}
    }
}
