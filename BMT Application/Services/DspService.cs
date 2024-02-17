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
    public class DspService : IDspService
    {
        private readonly IDspRepository _DspRepository;
        private readonly IAppLogger<DspService> _logger;
        private readonly IMapper _mapper;
        public DspService(IDspRepository storeRepository, IMapper mapper, IAppLogger<DspService> logger)
        {
            _DspRepository = storeRepository ?? throw new ArgumentNullException(nameof(storeRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        public async Task<IEnumerable<DspModel>> GetDspsByStatusList(int status)
        {
            var list = await _DspRepository.GetDspListByStatusAsync(status);
            var mapped = _mapper.Map<IEnumerable<DspModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<DspModel>> GetDspsList(string keyword)
        {
            var userList = await _DspRepository.GetDspByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<DspModel>>(userList);
            return mapped;
        }
        public async Task<IEnumerable<DspModel>> GetDspsAllListAsync(DspModel model)
        {
            var sModel = _mapper.Map<Dsp>(model);
            var userList = await _DspRepository.GetDspAllFiltersAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<DspModel>>(userList);
            return mapped;
        }

        public async Task<DspModel> GetDspByIdList(Int32 id)
        {
            var store = await _DspRepository.GetDspByIDeAsync(id);
            var mapped = _mapper.Map<DspModel>(store);
            return mapped;
        }
        public async Task<DspModel> Create(DspModel model)
        {
            await ValidateProductIfExist(model);
            model.IsMainDsp = 0;
            var mappedEntity = _mapper.Map<DspModel, Dsp>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _DspRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - AspnetRunAppService");

            var newMappedEntity = _mapper.Map<DspModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(DspModel model)
        {          
            var edit = await _DspRepository.GetDspByIDeAsync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");
            model.RowVer = edit.RowVer + 1;
            model.CreatedAt = edit.CreatedAt;
            model.CreatedBy = edit.CreatedBy;
            model.IsMainDsp = edit.IsMainDsp;
            _mapper.Map<DspModel, Dsp>(model, edit);
            await _DspRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - StoresService");
        }

        public async Task Delete(DspModel model)
        {
            ValidateProductIfNotExist(model);
            var vehicle = await _DspRepository.GetDspByIDeAsync(model.id);
            if (vehicle == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _DspRepository.DeleteAsync(vehicle);
            _logger.LogInformation($"Entity successfully deleted - StoresService");
        }

        private async Task ValidateProductIfExist(DspModel model)
        {
            var existingEntity = await _DspRepository.GetDspByIDeAsync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }

        private void ValidateProductIfNotExist(DspModel model)
        {
            var existingEntity = _DspRepository.GetDspByIDeAsync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");


        }
    }
}
