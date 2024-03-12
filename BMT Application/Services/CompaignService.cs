using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    public partial class CompaignService: ICompaignService
    {

        private readonly ICompaignRepository _compaignRepository;
        private readonly IAppLogger<CompaignService> _logger;
        private readonly IMapper _mapper;
        public CompaignService(ICompaignRepository CompaignRepository, IMapper mapper, IAppLogger<CompaignService> logger)
        {
            _compaignRepository = CompaignRepository ?? throw new ArgumentNullException(nameof(CompaignRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }      
        public async Task<IEnumerable<CompaignModel>> GetCompaignsListByStatusAsync(int status)
        {
           // var fiterEntity = _mapper.Map<Compaign>(CompaignModel);
            var mediaContentList = await _compaignRepository.GetCompaignByStatusAsync(status);
            var mapped = _mapper.Map<IEnumerable<CompaignModel>>(mediaContentList);
            return mapped;
        }
        public async Task<IEnumerable<CompaignModel>> GetCompainListByNameAsync(string name)
        {
            var mediaContentList = await _compaignRepository.GetCompaignsByNameAsync(name);
            var mapped = _mapper.Map<IEnumerable<CompaignModel>>(mediaContentList);
            return mapped;
        }    
        public async Task<IEnumerable<CompaignModel>> GetCompainListAllFiltersAsync(CompaignModel model)
        {
                var entity = _mapper.Map<Compaign>(model);
                var mediaContentList = await _compaignRepository.GetCompaignByAllFiltersAsync(entity);
            var mapped = _mapper.Map<IEnumerable<CompaignModel>>(mediaContentList);
            return mapped;
        }
        public async Task<CompaignModel> Create(CompaignModel model)
        {
            // await ValidateProductIfExist(PaymentModel);

            var mappedEntity = _mapper.Map<Compaign>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _compaignRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - PaymentService");

            var newMappedEntity = _mapper.Map<CompaignModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(CompaignModel model)
        {
            // ValidateProductIfNotExist(PaymentModel);

            var editEntity = await _compaignRepository.GetCompaignByIdAsync(model.Id);
            if (editEntity == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<CompaignModel, Compaign>(model, editEntity);

            await _compaignRepository.UpdateAsync(editEntity);
            _logger.LogInformation($"Entity successfully updated - PaymentService");
        }

        public async Task Delete(CompaignModel model)
        {
            // ValidateProductIfNotExist(PaymentModel);
            var deletedProduct = await _compaignRepository.GetCompaignByIdAsync(model.Id);
            if (deletedProduct == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _compaignRepository.DeleteAsync(deletedProduct);
            _logger.LogInformation($"Entity successfully deleted - PaymentService");
        }

    }
}
