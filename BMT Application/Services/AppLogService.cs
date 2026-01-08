using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.viewmodels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class AppLogService : IAppLogService
    {
        private readonly IAppLogRepository _appLogRepository;
        private readonly IAppLogger<AppLogService> _logger;
        private readonly IMapper _mapper;

        public AppLogService(IAppLogRepository appLogRepository, IMapper mapper, IAppLogger<AppLogService> logger)
        {
            _appLogRepository = appLogRepository ?? throw new ArgumentNullException(nameof(appLogRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
       
        public async Task<IEnumerable<ApplogModel>> GetApplogList()
        {
            var list = await _appLogRepository.GetAppLogListAsync();          
            var mapped = _mapper.Map<IEnumerable<ApplogModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<ApplogModel>> GetLogBySearchKeyword(string keyword)
        {
            var list = await _appLogRepository.GetAppLogByKeywordAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<ApplogModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<ApplogModel>> GetAppLogDetails(ApplogModel AppLogModel)
        {
            var entity = _mapper.Map<Applog>(AppLogModel);
            var list = await _appLogRepository.GetAppLogDetailsAsync(entity);
            var mapped = _mapper.Map<IEnumerable<ApplogModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<ApplogModel>> GetAppLogAllFiltersDetails(AppLogViewModel AppLogModel)
        {
           // var entity = _mapper.Map<Applog>(AppLogModel);
            var list = await _appLogRepository.GetAppLogAllFiltersAsync(AppLogModel);
            var mapped = _mapper.Map<IEnumerable<ApplogModel>>(list);
            return mapped;
        }
        public async Task<ApplogModel> GetApplogById(long logId)
        {
            var address = await _appLogRepository.GetAppLogByIDAsync(logId);
            var mapped = _mapper.Map<ApplogModel>(address);
            return mapped;
        }


        public async Task<IEnumerable<ApplogModel>> GetAppLogByUserId(int userId)
        {
            var AddressList = await _appLogRepository.GetAppLogByUserAsync(userId);
            var mapped = _mapper.Map<IEnumerable<ApplogModel>>(AddressList);
            return mapped;
        }

        public async Task Create(ApplogModel AppLogModel)
        {
            //await ValidateProductIfExist(AppLogModel);

            var mappedEntity = _mapper.Map<Applog>(AppLogModel);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _appLogRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - BMTLogService");

           // var newMappedEntity = ObjectMapper.Mapper.Map<AppLogModel>(newEntity);
           // return newMappedEntity;
        }

        public async Task Update(ApplogModel AppLogModel)
        {
           // ValidateEntityIfNotExist(AppLogModel);
            
            var editAddress = await _appLogRepository.GetAppLogByIDAsync(AppLogModel.Id);
            if (editAddress == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<ApplogModel, Applog>(AppLogModel, editAddress);

            await _appLogRepository.UpdateAsync(editAddress);
            _logger.LogInformation($"Entity successfully updated - AppLogService");
        }

        public async Task Delete(ApplogModel AppLogModel)
        {
           // ValidateProductIfNotExist(AppLogModel);
            var deletedProduct = await _appLogRepository.GetAppLogByIDAsync(AppLogModel.Id);
            if (deletedProduct == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _appLogRepository.DeleteAsync(deletedProduct);
            _logger.LogInformation($"Entity successfully deleted - AppLogService");
        }

        //private async Task ValidateProductIfExist(AppLogModel AppLogModel)
        //{
        //    var existingEntity = await _appLogRepository.GetAppLogByIDAsync(AppLogModel.AppLogId);
        //    if (existingEntity != null)
        //        throw new ApplicationException($"{AppLogModel.ToString()} with this id already exists");
        //}

        //private void ValidateProductIfNotExist(AppLogModel AppLogModel)
        //{
        //    var existingEntity = _appLogRepository.GetAppLogByIDAsync(AppLogModel.AppLogId);
        //    if (existingEntity == null)
        //        throw new ApplicationException($"{AppLogModel.AppLogId.ToString()} with this Id is not exists");
        //}
    }
}
