using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.util;
namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class TemplateVariablenService : ITemplatevariableService
    {
        private readonly ITemplatevariablerRepository _templatevariablerRepository;
        private readonly IAppLogger<TemplateVariablenService> _logger;
        private readonly IMapper _mapper;
        public TemplateVariablenService(ITemplatevariablerRepository templatevariablerRepository, IMapper mapper, IAppLogger<TemplateVariablenService> logger)
        {
            _templatevariablerRepository = templatevariablerRepository ?? throw new ArgumentNullException(nameof(templatevariablerRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }       
        public async Task<IEnumerable<TemplatevariableModel>> GetTemplateVariablesByNetworkByAsync(int orgId, int networkid)
        {
            var list = await _templatevariablerRepository.GetTemplateVariablesByNetworkIdAsync(orgId, networkid);
            var mapped = _mapper.Map<IEnumerable<TemplatevariableModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<TemplatevariableModel>> GetTemplateVariablesAllFiltersAsync(TemplatevariableModel notificationModel)
        {
            var entity = _mapper.Map<Templatevariable>(notificationModel);
            var list = await _templatevariablerRepository.GetTemplateVariablesByAllFiltersAsync(entity);
            var mapped = _mapper.Map<IEnumerable<TemplatevariableModel>>(list);
            return mapped;
        }
        public async Task<TemplatevariableModel> GetTemplateVariableById(long id )
        {
           // var entity = _mapper.Map<Notification>(notificationModel);
            var entity = await _templatevariablerRepository.GetTemplateVariableByIdAsync(id);
            var mapped = _mapper.Map<TemplatevariableModel>(entity);
            return mapped;
        }
        

        public async Task<TemplatevariableModel> Create(TemplatevariableModel notificationModel)
        {
           // await ValidateEntityIfExist(notificationModel);

            var mappedEntity = _mapper.Map<Templatevariable>(notificationModel);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _templatevariablerRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - BMTLogService");

            var newMappedEntity = _mapper.Map<TemplatevariableModel>(newEntity);
            return newMappedEntity;
        }
       
        public async Task Update(TemplatevariableModel notificationModel)
        {
          //  ValidateEntityIfNotExist(notificationModel);
            
            var entity = await _templatevariablerRepository.GetTemplateVariableByIdAsync(notificationModel.Id);
            if (entity == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<TemplatevariableModel, Templatevariable>(notificationModel, entity);

            await _templatevariablerRepository.UpdateAsync(entity);
            _logger.LogInformation($"Entity successfully updated - BMTLogService");
        }

        public async Task Delete(TemplatevariableModel notificationModel)
        {
           //  ValidateEntityIfNotExist(notificationModel);
            var deletedProduct = await _templatevariablerRepository.GetTemplateVariableByIdAsync(notificationModel.Id);
            if (deletedProduct == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _templatevariablerRepository.DeleteAsync(deletedProduct);
            _logger.LogInformation($"Entity successfully deleted - BMTLogService");
        }

        private async Task ValidateEntityIfExist(TemplatevariableModel notificationModel)
        {
            var existingEntity = await _templatevariablerRepository.GetTemplateVariableByIdAsync(notificationModel.Id);
            if (existingEntity != null)
                throw new ApplicationException($"{notificationModel.Name.ToString()} with this id already exists");
        }

        private void ValidateEntityIfNotExist(TemplatevariableModel notificationModel)
        {
            var existingEntity = _templatevariablerRepository.GetTemplateVariableByIdAsync(notificationModel.Id);
            if (existingEntity == null)
                throw new ApplicationException($"{notificationModel.Name.ToString()} with this subject is not exists");
        }
    }
}
