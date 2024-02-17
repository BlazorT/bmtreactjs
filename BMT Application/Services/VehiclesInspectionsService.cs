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
    public class VehiclesInspectionsService : IVehicleInspectionService
    {
        private readonly IVehiclesInspectionRepository _vehiclesInspectionRepository;
        private readonly IAppLogger<VehiclesInspectionsService> _logger;
        private readonly IMapper _mapper;
        public VehiclesInspectionsService(IVehiclesInspectionRepository vehiclesInspectionRepository, IMapper mapper, IAppLogger<VehiclesInspectionsService> logger)
        {
            _vehiclesInspectionRepository = vehiclesInspectionRepository ?? throw new ArgumentNullException(nameof(vehiclesInspectionRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        private object VehicleRepository()
        {
            throw new NotImplementedException();
        }    
  
        public async Task<IEnumerable<VehicleinspectionModel>> GetVehicleInspectionsListAsync()
        {
            var lst = await _vehiclesInspectionRepository.GetAllAsync();          
            var mapped = _mapper.Map<IEnumerable<VehicleinspectionModel>>(lst);
            return mapped;
        }
     
      
        public async Task<VehicleinspectionModel> GGetVehicleInspectionByIdSync(Int64 id)
        {
            var model = await _vehiclesInspectionRepository.GGetVehicleInspectionByIdSync(id);
            var mapped = _mapper.Map<VehicleinspectionModel>(model);
            return mapped;
        }

        public async Task<IEnumerable<VehicleinspectionModel>> GGetVehicleInspectionByReportIdSync(Int64 Reportid)
        {
            var lst = await _vehiclesInspectionRepository.GGetVehicleInspectionByReportIdSync(Reportid);
            var mapped = _mapper.Map<IEnumerable<VehicleinspectionModel>>(lst);
            return mapped;
        }

       
        public async Task<IEnumerable<VehicleinspectionModel>> GetVehiclesByVehicleIdAndStatusAsnc(Int64 vehicleId, int status)
        {
            var lst = await _vehiclesInspectionRepository.GetVehiclesByVehicleIdAndStatusAsnc(vehicleId, status);
            var mList = _mapper.Map<IEnumerable<VehicleinspectionModel>>(lst);
            return mList;
        }
        public async Task<IEnumerable<VehicleinspectionModel>> GetVehiclesAllFiltersAsync(VehicleinspectionModel model)
        {
            var vehicle = _mapper.Map<VehicleinspectionModel, Vehicleinspection>(model);
            var vLst = await _vehiclesInspectionRepository.GetVehiclesAllFiltersAsync(vehicle);
            var mList = _mapper.Map<IEnumerable<VehicleinspectionModel>>(vLst);
            return mList;
        }
        public async Task<IEnumerable<VehicleinspectionModel>> BulkAddorUpdates(List<VehicleinspectionModel> ls)
        {
            var incList = _mapper.Map<IEnumerable<Vehicleinspection>>(ls);
            var vLst = await _vehiclesInspectionRepository.bulkaddorupdates(incList.ToList());
            var retLs = _mapper.Map<IEnumerable<VehicleinspectionModel>>(vLst);

            return retLs;
        }
        public async Task<VehicleinspectionModel> Create(VehicleinspectionModel model)
        {
            //await ValidateProductIfExist(model);

            var mappedEntity = _mapper.Map<VehicleinspectionModel, Vehicleinspection>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _vehiclesInspectionRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - VehiclesInspectionsService");

            var newMappedEntity = _mapper.Map<VehicleinspectionModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(VehicleinspectionModel model)
        {
           // ValidateProductIfNotExist(model);
            
            var edit = await _vehiclesInspectionRepository.GGetVehicleInspectionByIdSync(model.Id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<VehicleinspectionModel, Vehicleinspection>(model, edit);

            await _vehiclesInspectionRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - VehiclesInspectionsService");
        }

        public async Task Delete(VehicleinspectionModel model)
        {
            ValidateProductIfNotExist(model);
            var vehicle = await _vehiclesInspectionRepository.GGetVehicleInspectionByIdSync(model.Id);
            if (vehicle == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _vehiclesInspectionRepository.DeleteAsync(vehicle);
            _logger.LogInformation($"Entity successfully deleted - VehiclesInspectionsService");
        }

        private async Task ValidateProductIfExist(VehicleinspectionModel model)
        {
            var existingEntity = await _vehiclesInspectionRepository.GGetVehicleInspectionByIdSync(model.Id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.Id} with this id already exists");
        }

        private void ValidateProductIfNotExist(VehicleinspectionModel model)
        {
            var existingEntity = _vehiclesInspectionRepository.GGetVehicleInspectionByIdSync(model.Id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.Id} with this id is not exists");
        }
    }
}
