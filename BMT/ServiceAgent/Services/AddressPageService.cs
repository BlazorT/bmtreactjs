
using Blazor.Web.UI.Interfaces;
// Microsoft Namespaces
using AutoMapper;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;

namespace Blazor.Web.UI.Services
{
    public class AddressPageService : IAddressPageService
    {
        private readonly IAddressService _addressAppService;        
        private readonly IMapper _mapper;
        private readonly ILogger<AddressPageService> _logger;

        public AddressPageService(IAddressService addressservice, IMapper mapper, ILogger<AddressPageService> logger)
        {
            _addressAppService = addressservice ?? throw new ArgumentNullException(nameof(addressservice));          
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<AddressViewModel>> GetAddress()
        {

            var address = await _addressAppService.GetAddressList();
            var mappedByName = _mapper.Map<IEnumerable<AddressViewModel>>(address);
            return mappedByName;
        }
        public async Task<IEnumerable<AddressViewModel>> GetAddress(string name)
        {
            var listByName = await _addressAppService.GetAddressList(name);
            var mappedByName = _mapper.Map<IEnumerable<AddressViewModel>>(listByName);
            return mappedByName;
        }
        public async Task<AddressViewModel> GetAddressById(int addressId)
        {
            var address = await _addressAppService.GetAddressById(addressId);
            var mappedByName = _mapper.Map<AddressViewModel>(address);
        //  var mapped = _mapper.Map<IEnumerable<PriceViewModel>>(list);
            return mappedByName;
        }

        public async Task<IEnumerable<AddressViewModel>> GetAddressByName(int userId)
        {
            var list = await _addressAppService.GetAddressByName(userId);
            var mapped = _mapper.Map<IEnumerable<AddressViewModel>>(list);
            return mapped;
        }

        public async Task<AddressViewModel> CreateAddress(AddressViewModel AddressViewModel)
        {
            var mapped = _mapper.Map<AddressModel>(AddressViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");           
            var entityDto = await _addressAppService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - AuthorsPageService");

            var mappedViewModel = _mapper.Map<AddressViewModel>(entityDto);
            return mappedViewModel;
        }

        public async Task UpdateAddress(AddressViewModel AddressViewModel)
        {
            var mapped = _mapper.Map<AddressModel>(AddressViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _addressAppService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - AddressPageService");
        }

        public async Task DeleteAddress(AddressViewModel AddressViewModel)
        {
            var mapped = _mapper.Map<AddressModel>(AddressViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _addressAppService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - AddressPageService");
        }
    }
}
