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
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class ConfigurationsService : IConfigurationsService
    {
        private readonly IConfigurationsRepository _configurationsRepository;
        private readonly IAppLogger<ConfigurationsService> _logger;
        private readonly IMapper _mapper;
        public ConfigurationsService(IConfigurationsRepository configRepository, IMapper mapper, IAppLogger<ConfigurationsService> logger)
        {
            try
            {
                _configurationsRepository = configRepository ?? throw new ArgumentNullException(nameof(configRepository));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }
            catch (Exception ex) {
                _logger.LogInformation("Configuration service initialization failed", ex);
                throw ex;
            }
        }
        
        public async Task<IEnumerable<ConfigurationModel>> GetConfigurstionsListByStatusAsync(int Status)
        {
            try
            {
                var list = await _configurationsRepository.GetListByStatusAsync(Status);
                var mapped = _mapper.Map<IEnumerable<ConfigurationModel>>(list);
                return mapped;
            }
            catch (Exception ex)
            {
                _logger.LogInformation("ConfigurationsService failed", ex);
                throw ex;
            }
        }
        public async Task<ConfigurationModel> GetConfigurstionByKeyAndDspeAsync(int Dspid, string key)
        {
            try
            {
                var conf = await _configurationsRepository.GetListByDspAndKeyAsync(Dspid, key);
                if (conf == null)
                    conf = new Configuration();
                var mapped = _mapper.Map<ConfigurationModel>(conf);
                return mapped;
            }
            catch (Exception ex)
            {
                _logger.LogInformation("ConfigurationsService failed", ex);
                throw ex;
            }
        }
        public async Task<IEnumerable<ConfigurationModel>> GetConfigurationByDspAsync(int DspId)
        {
            try
            {
                var lst = await _configurationsRepository.getConfigurationListAsyncByDSP(DspId);
                var mapped = _mapper.Map<IEnumerable<ConfigurationModel>>(lst);
                return mapped;
            }
            catch (Exception ex)
            {
                _logger.LogInformation("ConfigurationsService failed", ex);
                throw ex;
            }
        }
        public async Task<ConfigurationModel> GetConfigurationByKeyAsync(string key)
        {
            try
            {
                var lst = await _configurationsRepository.GetConfigurationByKeyAsync(key);
                var mapped = _mapper.Map<ConfigurationModel>(lst);
                return mapped;
            }
            catch (Exception ex)
            {
                _logger.LogInformation("ConfigurationsService failed", ex);
                throw ex;
            }
        }

        public async Task<ConfigurationModel> Create(ConfigurationModel configurationsModel)
        {
           // await ValidateAuthorIfExist(ConfigurationsModel);

            var entity = _mapper.Map<Configuration>(configurationsModel);
            if (entity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _configurationsRepository.AddAsync(entity);
            _logger.LogInformation($"Entity successfully added - ConfigurationsService");

            var newMappedEntity = _mapper.Map<ConfigurationModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(ConfigurationModel configurationsModel)
        {
           // ValidateEntityIfNotExist(AuthorsModel);

            var editEntity = await _configurationsRepository.GetConfigurationsByIdAsync(configurationsModel.id);
            if (editEntity == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<ConfigurationModel, Configuration>(configurationsModel, editEntity);

            await _configurationsRepository.UpdateAsync(editEntity);
            _logger.LogInformation($"Entity successfully updated - ConfigurationsService");
        }
        public async Task<IEnumerable<ConfigurationModel>> GetListByNameAsync(string keyword)
        {
            try
            {
                var userList = await _configurationsRepository.GetListByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<ConfigurationModel>>(userList);
            return mapped;
        }
            catch (Exception ex) {
                _logger.LogInformation("GetStatesList failed", ex);
                throw ex;
            }
}
      
    }
}
