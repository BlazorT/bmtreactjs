using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class IntegrationService : IIntegrationService
    {
        private readonly IIntegrationRepository _IntegrationRepository;
        private readonly IAppLogger<IntegrationService> _logger;
        private readonly IMapper _mapper;
        public IntegrationService(IIntegrationRepository integrationRepository, IMapper mapper, IAppLogger<IntegrationService> logger)
        {
            _IntegrationRepository = integrationRepository ?? throw new ArgumentNullException(nameof(integrationRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        public async Task<IEnumerable<IntegrationservicesettingModel>> GetIntegrationserviceListByStatusAsync(int status)
        {
            var list = await _IntegrationRepository.GetIntegrationserviceListByStatusAsync(status);
            var mapped = _mapper.Map<IEnumerable<IntegrationservicesettingModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<IntegrationservicesettingModel>> GetIntegrationserviceByNameAsync(string keyword)
        {
            var userList = await _IntegrationRepository.GetIntegrationserviceByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<IntegrationservicesettingModel>>(userList);
            return mapped;
        }
        public async Task<IEnumerable<IntegrationservicesettingModel>> GetIntegrationserviceAllFiltersAsync(IntegrationservicesettingModel model)
        {
            var sModel = _mapper.Map<Integrationservicesetting>(model);
            var userList = await _IntegrationRepository.GetIntegrationserviceAllFiltersAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<IntegrationservicesettingModel>>(userList);
            return mapped;
        }

        public async Task<IntegrationservicesettingModel> GetByIdAsync(Int32 id)
        {
            var store = await _IntegrationRepository.GetByIdAsync(id);
            var mapped = _mapper.Map<IntegrationservicesettingModel>(store);
            return mapped;
        }
        public async Task<IntegrationservicesettingModel> Create(IntegrationservicesettingModel model)
        {
            await ValidateProductIfExist(model);

            var mappedEntity = _mapper.Map<IntegrationservicesettingModel, Integrationservicesetting>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _IntegrationRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - IntegrationService");

            var newMappedEntity = _mapper.Map<IntegrationservicesettingModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(IntegrationservicesettingModel model)
        {            
            //ObjectMapper.Mapper.Map<UserModel, User>(model, editPrice);
            var edit = await _IntegrationRepository.GetByIdAsync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<IntegrationservicesettingModel, Integrationservicesetting>(model, edit);
            await _IntegrationRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - IntegrationService");
        }

        public async Task Delete(IntegrationservicesettingModel model)
        {
            ValidateProductIfNotExist(model);
            var vehicle = await _IntegrationRepository.GetByIdAsync(model.id);
            if (vehicle == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _IntegrationRepository.DeleteAsync(vehicle);
            _logger.LogInformation($"Entity successfully deleted - IntegrationService");
        }

        private async Task ValidateProductIfExist(IntegrationservicesettingModel model)
        {
            var existingEntity = await _IntegrationRepository.GetByIdAsync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }

        private void ValidateProductIfNotExist(IntegrationservicesettingModel model)
        {
            var existingEntity =  _IntegrationRepository.GetByIdAsync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");


        }
    }
}
