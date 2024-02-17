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
    public class VehiclesService : IVehiclesService
    {
        private readonly IVehiclesRepository _vehiclesRepository;
        private readonly IAppLogger<VehiclesService> _logger;
        private readonly IMapper _mapper;
        public VehiclesService(IVehiclesRepository vehiclesRepository, IMapper mapper, IAppLogger<VehiclesService> logger)
        {
            _vehiclesRepository = vehiclesRepository ?? throw new ArgumentNullException(nameof(vehiclesRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        private object VehiclesRepository()
        {
            throw new NotImplementedException();
        }       
               
        public async Task<IEnumerable<VehicleModel>> GetVehiclesList()
        {
            var lst = await _vehiclesRepository.GetAllAsync();          
            var mapped = _mapper.Map<IEnumerable<VehicleModel>>(lst);
            return mapped;
        }
        public async Task<IEnumerable<VehicleModel>> GetVehiclesByName(string name)
        {
            var lst = await _vehiclesRepository.GetVehiclesByNameAsync(name);
            var mapped = _mapper.Map<IEnumerable<VehicleModel>>(lst);
            return mapped;
        }
      
        public async Task<VehicleModel> GetVehicleById(Int64 id)
        {
            var model = await _vehiclesRepository.GetVehicleByIdSync(id);
            var mapped = _mapper.Map<VehicleModel>(model);
            return mapped;
        }
        public async Task<IEnumerable<VehicleModel>> GetVehiclesByDspAndStatusAsnc(int dspId, int status) {
            var lst = await _vehiclesRepository.GetVehiclesByDspAndStatusAsnc(dspId, status);
            var mList = _mapper.Map<IEnumerable<VehicleModel>>(lst);
            return mList;   
    }
        public async Task<IEnumerable<VehicleModel>> GetVehiclesByCategoryAndStatusAsnc(int categoryId, int status) {
            var lst = await _vehiclesRepository.GetVehiclesByCategoryAndStatusAsnc(categoryId, status);
            var mList = _mapper.Map<IEnumerable<VehicleModel>>(lst);
            return mList;
        }
        public async Task<IEnumerable<VehicleModel>> GetVehiclesAllFiltersAsync(VehicleModel model)
        {
            var vehicle = _mapper.Map<VehicleModel, Vehicle>(model);
            var vLst = await _vehiclesRepository.GetVehiclesAllFiltersAsync(vehicle);
            var mList = _mapper.Map<IEnumerable<VehicleModel>>(vLst);
            return mList;
        }

        public async Task<VehicleModel> Create(VehicleModel model)
        {
            //await ValidateProductIfExist(model);

            var mappedEntity = _mapper.Map<VehicleModel, Vehicle>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _vehiclesRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - VehiclesService");

            var newMappedEntity = _mapper.Map<VehicleModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(VehicleModel model)
        {
           // ValidateProductIfNotExist(model);
            
            var edit = await _vehiclesRepository.GetVehicleByIdSync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<VehicleModel, Vehicle>(model, edit);

            await _vehiclesRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - VehiclesService");
        }

        public async Task Delete(VehicleModel model)
        {
            ValidateProductIfNotExist(model);
            var vehicle = await _vehiclesRepository.GetVehicleByIdSync(model.id);
            if (vehicle == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _vehiclesRepository.DeleteAsync(vehicle);
            _logger.LogInformation($"Entity successfully deleted - VehiclesService");
        }

        private async Task ValidateProductIfExist(VehicleModel model)
        {
            var existingEntity = await _vehiclesRepository.GetVehicleByIdSync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.Name} with this id already exists");
        }

        private void ValidateProductIfNotExist(VehicleModel model)
        {
            var existingEntity = _vehiclesRepository.GetVehicleByIdSync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.Name} with this id is not exists");
        }
    }
}
