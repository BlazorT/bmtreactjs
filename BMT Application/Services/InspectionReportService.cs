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
    public class InspectionReportService : IInspectionReportService
    {
        private readonly IInspectionReportRepository _inspectionReportRepository;
        private readonly IAppLogger<VehiclesInspectionsService> _logger;
        private readonly IMapper _mapper;
        public InspectionReportService(IInspectionReportRepository inspectionReportRepository, IMapper mapper, IAppLogger<VehiclesInspectionsService> logger)
        {
            _inspectionReportRepository = inspectionReportRepository ?? throw new ArgumentNullException(nameof(inspectionReportRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        private object VehicleRepository()
        {
            throw new NotImplementedException();
        }    
  
        public async Task<IEnumerable<InspectionreportModel>> GetVehicleInspectionReportsListAsync()
        {
            var lst = await _inspectionReportRepository.GetAllAsync();          
            var mapped = _mapper.Map<IEnumerable<InspectionreportModel>>(lst);
            return mapped;
        }      
        public async Task<InspectionreportModel> GetVehicleInspectionReportByIdSync(Int64 id)
        {
            var model = await _inspectionReportRepository.GGetVehicleInspectionReportByIdSync(id);
            var mapped = _mapper.Map<InspectionreportModel>(model);
            return mapped;
        }
        
        public async Task<IEnumerable<InspectionreportModel>> GetVehicleInspectionsByVehicleIdAndStatusAsnc(Int64 vehicleId, int status)
        {
            var lst = await _inspectionReportRepository.GetVehicleINspectionReportsByVehicleIdAndStatusAsnc(vehicleId, status);
            var mList = _mapper.Map<IEnumerable<InspectionreportModel>>(lst);
            return mList;
        }
        public async Task<IEnumerable<InspectionreportModel>> GetVehicleInspectionsAllFiltersAsync(InspectionreportModel model)
        {
            var inspection = _mapper.Map<InspectionreportModel, Inspectionreport>(model);
            var vLst = await _inspectionReportRepository.GetVehicleReportsAllFiltersAsync(inspection);
            var mList = _mapper.Map<IEnumerable<InspectionreportModel>>(vLst);
            return mList;
        }
        public async Task<InspectionreportModel> CreateInspectionReportWithItems(InspectionreportModel model)
        {
              InspectionReportIfExist(model);

            var mappedEntity = _mapper.Map<InspectionreportModel, Inspectionreport>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _inspectionReportRepository.AddAsync(mappedEntity);
           

            _logger.LogInformation($"Entity successfully added - AspnetRunAppService");

            var newMappedEntity = _mapper.Map<InspectionreportModel>(newEntity);
            return newMappedEntity;
        }
        public async Task<InspectionreportModel> Create(InspectionreportModel model)
        {
            //await ValidateProductIfExist(model);

            var mappedEntity = _mapper.Map<InspectionreportModel, Inspectionreport>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _inspectionReportRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - InspectionService");

            var newMappedEntity = _mapper.Map<InspectionreportModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(InspectionreportModel model)
        {
           // ValidateProductIfNotExist(model);
            
            var edit = await _inspectionReportRepository.GGetVehicleInspectionReportByIdSync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<InspectionreportModel, Inspectionreport>(model, edit);

            await _inspectionReportRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - InspectionService");
        }

        public async Task Delete(InspectionreportModel model)
        {
            InspectionReportIfExist(model);
            var inspection = await _inspectionReportRepository.GGetVehicleInspectionReportByIdSync(model.id);
            if (inspection == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _inspectionReportRepository.DeleteAsync(inspection);
            _logger.LogInformation($"Entity successfully deleted - InspectionService");
        }

        private async Task ValidateProductIfExist(InspectionreportModel model)
        {
            var existingEntity = await _inspectionReportRepository.GGetVehicleInspectionReportByIdSync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.id} with this id already exists");
        }
        private void InspectionReportIfExist(InspectionreportModel model)
        {
            var existingEntity = _inspectionReportRepository.GGetVehicleInspectionReportByIdSync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.id} with this id is not exists");
        }
    }    
   
}
