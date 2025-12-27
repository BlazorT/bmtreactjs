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
    public class OrglicensingService : IOrglicensingService
    {
        private readonly IOrglicensingRepository _orglicensingRepository;
        private readonly IAppLogger<OrglicensingService> _logger;
        private readonly IMapper _mapper;
        public OrglicensingService(IOrglicensingRepository orglicensingRepository, IMapper mapper, IAppLogger<OrglicensingService> logger)
        {
            _orglicensingRepository = orglicensingRepository ?? throw new ArgumentNullException(nameof(orglicensingRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<OrglicensingModel>> GetOrglicensingByNetworkAndOrglist(int orgId, int networkid)
        {
            var list = await _orglicensingRepository.GetOrglicensingsBynetworkAndOrgAsync(orgId, networkid);
            var mapped = _mapper.Map<IEnumerable<OrglicensingModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<OrglicensingModel>> GetOrglicensingList(string keyword)
        {
            var list = await _orglicensingRepository.GetOrglicensingByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<OrglicensingModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<OrglicensingModel>> GetOrglicensingsAllListAsync(OrglicensingModel notificationModel)
        {
            var entity = _mapper.Map<Orglicensing>(notificationModel);
            var list = await _orglicensingRepository.GetOrglicensingsAllFiltersAsync(entity);
            var mapped = _mapper.Map<IEnumerable<OrglicensingModel>>(list);
            return mapped;
        }
        public async Task<OrglicensingModel> GetOrglicensingById(long id )
        {
           // var entity = _mapper.Map<Notification>(notificationModel);
            var entity = await _orglicensingRepository.GetOrglicensingByIdAsync(id);
            var mapped = _mapper.Map<OrglicensingModel>(entity);
            return mapped;
        }
        

        public async Task<OrglicensingModel> Create(OrglicensingModel notificationModel)
        {
           // await ValidateEntityIfExist(notificationModel);

            var mappedEntity = _mapper.Map<Orglicensing>(notificationModel);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _orglicensingRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - OrgLicensingService");

            var newMappedEntity = _mapper.Map<OrglicensingModel>(newEntity);
            return newMappedEntity;
        }
       
        public async Task Update(OrglicensingModel notificationModel)
        {
          //  ValidateEntityIfNotExist(notificationModel);
            
            var entity = await _orglicensingRepository.GetOrglicensingByIdAsync(notificationModel.Id);
            if (entity == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<OrglicensingModel, Orglicensing>(notificationModel, entity);

            await _orglicensingRepository.UpdateAsync(entity);
            _logger.LogInformation($"Entity successfully updated - BMTLogService");
        }

        public async Task Delete(OrglicensingModel notificationModel)
        {
           //  ValidateEntityIfNotExist(notificationModel);
            var deletedProduct = await _orglicensingRepository.GetOrglicensingByIdAsync(notificationModel.Id);
            if (deletedProduct == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _orglicensingRepository.DeleteAsync(deletedProduct);
            _logger.LogInformation($"Entity successfully deleted - BMTLogService");
        }

        private async Task ValidateEntityIfExist(OrglicensingModel notificationModel)
        {
            var existingEntity = await _orglicensingRepository.GetOrglicensingByIdAsync(notificationModel.Id);
            if (existingEntity != null)
                throw new ApplicationException($"{notificationModel.Name.ToString()} with this id already exists");
        }

        private void ValidateEntityIfNotExist(OrglicensingModel notificationModel)
        {
            var existingEntity = _orglicensingRepository.GetOrglicensingByIdAsync(notificationModel.Id);
            if (existingEntity == null)
                throw new ApplicationException($"{notificationModel.Name.ToString()} with this subject is not exists");
        }
    }
}
