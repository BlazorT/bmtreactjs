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
    public class BasicConfigurationsService : IBasicConfigurationsService
    {
        private readonly IBasicConfigurationsRepository _basicconfigurationsRepository;
        private readonly IAppLogger<BasicConfigurationsService> _logger;
        private readonly IMapper _mapper;
        public BasicConfigurationsService(IBasicConfigurationsRepository basicconfigRepository, IMapper mapper, IAppLogger<BasicConfigurationsService> logger)
        {
            try
            {
                _basicconfigurationsRepository = basicconfigRepository ?? throw new ArgumentNullException(nameof(basicconfigRepository));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }
            catch (Exception ex) {
                _logger.LogInformation("Configuration service initialization failed", ex);
                throw ex;
            }
        }
        
        public async Task<IEnumerable<BasicConfigurationModel>> GetBasicConfigurstionsListByStatusAsync(int Status)
        {
            try
            {
                var list = await _basicconfigurationsRepository.GetListByStatusAsync(Status);
                var mapped = _mapper.Map<IEnumerable<BasicConfigurationModel>>(list);
                return mapped;
            }
            catch (Exception ex)
            {
                _logger.LogInformation("BasicConfigurationsService failed", ex);
                throw ex;
            }
        }

        public async Task<BasicConfigurationModel> GetBasicConfigurstionByIdAsync(int id)
        {
            try
            {
                var conf = await _basicconfigurationsRepository.GetByIdAsync(id);
                if (conf == null)
                    conf = new Basicconfiguration();
                var mapped = _mapper.Map<BasicConfigurationModel>(conf);
                return mapped;
            }
            catch (Exception ex)
            {
                _logger.LogInformation("BasicConfigurationsService failed", ex);
                throw ex;
            }
        }

        public async Task<BasicConfigurationModel> GetBasicConfigurstionByKeyAndStoreAsync(int ShowRoomId, string key)
        {
            try
            {
                var conf = await _basicconfigurationsRepository.GetListByDspAndKeyAsync( key);
                if (conf == null)
                    conf = new Basicconfiguration();
                var mapped = _mapper.Map<BasicConfigurationModel>(conf);
                return mapped;
            }
            catch (Exception ex)
            {
                _logger.LogInformation("GetListByStatusAsync failed", ex);
                throw ex;
            }
        }

        public async Task<BasicConfigurationModel> GetBasicConfigurationByKeyAsync(string key)
        {
            try
            {
                var lst = await _basicconfigurationsRepository.GetBasicConfigurationByKeyAsync(key);
                var mapped = _mapper.Map<BasicConfigurationModel>(lst);
                return mapped;
            }
            catch (Exception ex)
            {
                _logger.LogInformation("GetConfigurationByKeyAsync failed", ex);
                throw ex;
            }
        }

        public async Task<BasicConfigurationModel> Create(BasicConfigurationModel configurationsModel)
        {
           // await ValidateAuthorIfExist(ConfigurationsModel);

            var entity = _mapper.Map<Basicconfiguration>(configurationsModel);
            if (entity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _basicconfigurationsRepository.AddAsync(entity);
            _logger.LogInformation($"Entity successfully added - BasicConfigurationsService");

            var newMappedEntity = _mapper.Map<BasicConfigurationModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(BasicConfigurationModel configurationsModel)
        {
           // ValidateEntityIfNotExist(AuthorsModel);

            var editEntity = await _basicconfigurationsRepository.GetBasicConfigurationsByIdAsync(configurationsModel.Id);
            if (editEntity == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<BasicConfigurationModel, Basicconfiguration>(configurationsModel, editEntity);

            await _basicconfigurationsRepository.UpdateAsync(editEntity);
            _logger.LogInformation($"Entity successfully updated - BasicConfigurationsService");
        }
        public async Task<IEnumerable<BasicConfigurationModel>> GetListByNameAsync(string keyword)
        {
            try
            {
                var userList = await _basicconfigurationsRepository.GetListByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<BasicConfigurationModel>>(userList);
            return mapped;
        }
            catch (Exception ex) {
                _logger.LogInformation("BasicConfigurationsService failed", ex);
                throw ex;
            }
}
      
    }
}
