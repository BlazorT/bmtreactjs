using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class InventoryDetailService : IInventoryDetailService
    {
        private readonly IInventoryRepository _inventoryRepository;
        private readonly IAppLogger<InventoryDetailService> _logger;
        private readonly IMapper _mapper;
        public InventoryDetailService(IInventoryRepository inventoryRepository, IMapper mapper, IAppLogger<InventoryDetailService> logger)
        {
            _inventoryRepository = inventoryRepository ?? throw new ArgumentNullException(nameof(inventoryRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        private object VehiclesRepository()
        {
            throw new NotImplementedException();
        }
  
    
        public async Task<IEnumerable<InventorydetailModel>> GetInventoryDataAsync()
        {
            var lst = await _inventoryRepository.GetAllAsync();          
            var mapped = _mapper.Map<IEnumerable<InventorydetailModel>>(lst);
            return mapped;
        }
        public async Task<IEnumerable<InventorydetailModel>> GetInventoryDataByProductDetailIdAsync(int productDetailsId)
        {
            var lst = await _inventoryRepository.GetInventoryDataByProductDetailIdAsync(productDetailsId);
            var mapped = _mapper.Map<IEnumerable<InventorydetailModel>>(lst);
            return mapped;
        }
      
        public async Task<InventorydetailModel> GetInventoryDataByIdSync(Int64 id)
        {
            var model = await _inventoryRepository.GetInventoryDataByIdSync(id);
            var mapped = _mapper.Map<InventorydetailModel>(model);
            return mapped;
        }
        public async Task<IEnumerable<InventorydetailModel>> GetInventoryDetailsByDspAndStatusAsnc(int dspId, int status) {
            var lst = await _inventoryRepository.GetInventoryDetailsByDspAndStatusAsnc(dspId, status);
            var mList = _mapper.Map<IEnumerable<InventorydetailModel>>(lst);
            return mList;   
    }
    
        public async Task<IEnumerable<InventorydetailModel>> GetInventoryDataAllFiltersAsync(InventorydetailModel model)
        {
            var vehicle = _mapper.Map<InventorydetailModel, Inventorydetail>(model);
            var vLst = await _inventoryRepository.GetInventoryDataAllFiltersAsync(vehicle);
            var mList = _mapper.Map<IEnumerable<InventorydetailModel>>(vLst);
            return mList;
        }
        public async Task<IEnumerable<InventorydetailModel>> addorupdateInventoryDetails(List<InventorydetailModel> ls) {
            var incList = _mapper.Map<IEnumerable<Inventorydetail>>(ls);
            var vLst = await _inventoryRepository.addorupdateInventoryDetails(incList.ToList());
            var retLs= _mapper.Map<IEnumerable<InventorydetailModel>>(vLst);

            return retLs;
        }
        public async Task<InventorydetailModel> Create(InventorydetailModel model)
        {
            //await ValidateProductIfExist(model);

            var mappedEntity = _mapper.Map<InventorydetailModel, Inventorydetail>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _inventoryRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - InventoryDetailService");

            var newMappedEntity = _mapper.Map<InventorydetailModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(InventorydetailModel model)
        {
           // ValidateProductIfNotExist(model);
            
            var edit = await _inventoryRepository.GetInventoryDataByIdSync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<InventorydetailModel, Inventorydetail>(model, edit);

            await _inventoryRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - InventoryDetailService");
        }

        public async Task Delete(InventorydetailModel model)
        {
            ValidateProductIfNotExist(model);
            var vehicle = await _inventoryRepository.GetInventoryDataByIdSync(model.id);
            if (vehicle == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _inventoryRepository.DeleteAsync(vehicle);
            _logger.LogInformation($"Entity successfully deleted - InventoryDetailService");
        }

        private async Task ValidateProductIfExist(InventorydetailModel model)
        {
            var existingEntity = await _inventoryRepository.GetInventoryDataByIdSync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.id} with this id already exists");
        }

        private void ValidateProductIfNotExist(InventorydetailModel model)
        {
            var existingEntity = _inventoryRepository.GetInventoryDataByIdSync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.id} with this id is not exists");
        }
    }
}
