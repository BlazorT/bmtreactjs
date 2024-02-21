using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class AddressService : IAddressService
    {
        private readonly IAddressRepository _addressRepository;
        private readonly IAppLogger<AddressService> _logger;
        private readonly IMapper _mapper;
        public AddressService(IAddressRepository addressRepository, IMapper mapper, IAppLogger<AddressService> logger)
        {
            _addressRepository = addressRepository ?? throw new ArgumentNullException(nameof(addressRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        private object addressRepository()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<AddressModel>> GetAddressList()
        {
            var addressList = await _addressRepository.GetAddressListAsync();          
            var mapped = _mapper.Map<IEnumerable<AddressModel>>(addressList);
            return mapped;
        }
        public async Task<IEnumerable<AddressModel>> GetAddressList(string address)
        {
            var addressList = await _addressRepository.GetAddressByNameAsync(address);
            var mapped = _mapper.Map<IEnumerable<AddressModel>>(addressList);
            return mapped;
        }
      
        public async Task<AddressModel> GetAddressById(int addressId)
        {
            var address = await _addressRepository.GetByIdAsync(addressId);
            var mapped = _mapper.Map<AddressModel>(address);
            return mapped;
        }


        public async Task<IEnumerable<AddressModel>> GetAddressByName(int userId)
        {
            var AddressList = await _addressRepository.GetAddressByUserAsync(userId);
            var mapped = _mapper.Map<IEnumerable<AddressModel>>(AddressList);
            return mapped;
        }

        public async Task<AddressModel> Create(AddressModel AddressModel)
        {
            await ValidateProductIfExist(AddressModel);

            var mappedEntity = _mapper.Map<Address>(AddressModel);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _addressRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - AddressService");

            var newMappedEntity = _mapper.Map<AddressModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(AddressModel AddressModel)
        {
            ValidateProductIfNotExist(AddressModel);
            
            var editAddress = await _addressRepository.GetByIdAsync(AddressModel.id);
            if (editAddress == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<AddressModel, Address>(AddressModel, editAddress);

            await _addressRepository.UpdateAsync(editAddress);
            _logger.LogInformation($"Entity successfully updated - AddressService");
        }

        public async Task Delete(AddressModel AddressModel)
        {
            ValidateProductIfNotExist(AddressModel);
            var deletedProduct = await _addressRepository.GetByIdAsync(AddressModel.id);
            if (deletedProduct == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _addressRepository.DeleteAsync(deletedProduct);
            _logger.LogInformation($"Entity successfully deleted - AddressService");
        }

        private async Task ValidateProductIfExist(AddressModel AddressModel)
        {
            var existingEntity = await _addressRepository.GetByIdAsync(AddressModel.id);
            if (existingEntity != null)
                throw new ApplicationException($"{AddressModel.ToString()} with this id already exists");
        }

        private void ValidateProductIfNotExist(AddressModel AddressModel)
        {
            var existingEntity = _addressRepository.GetByIdAsync(AddressModel.id);
            if (existingEntity == null)
                throw new ApplicationException($"{AddressModel.ToString()} with this Id is not exists");
        }
    }
}
