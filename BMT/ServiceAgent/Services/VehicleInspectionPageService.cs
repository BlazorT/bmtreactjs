using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.util;

namespace com.blazor.bmt.ui.services
{
    public class VehicleInspectionPageService : IVehicleInspectionPageService
    {
        private readonly IVehicleInspectionService _vehicleInspectionService;
        private readonly IInspectionReportService _inspectionReportService;       
        private readonly IMapper _mapper;
        private readonly ILogger<VehiclesPageService> _logger;

        public VehicleInspectionPageService(IVehicleInspectionService vehicleInspectionService, IInspectionReportService inspectionReportService, IInspectionItemsService inspectionItemsService, IMapper mapper, ILogger<VehiclesPageService> logger)
        {
            _vehicleInspectionService = vehicleInspectionService ?? throw new ArgumentNullException(nameof(vehicleInspectionService));
            // _inspectionItemsService = inspectionItemsService ?? throw new ArgumentNullException(nameof(inspectionItemsService));
            _inspectionReportService = inspectionReportService ?? throw new ArgumentNullException(nameof(inspectionReportService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }       
        public async Task<IEnumerable<VehicleinspectionItemViewModel>> GetVehicleInspectionsList() {          
            var list = await _vehicleInspectionService.GetVehicleInspectionsListAsync();
            var mapped = _mapper.Map<IEnumerable<VehicleinspectionItemViewModel>>(list);
            return mapped;

        }
     
  
        public async Task<VehicleinspectionItemViewModel> GetVehicleInspectionById(Int64 id)
        {
            var model = await _vehicleInspectionService.GGetVehicleInspectionByIdSync(id);
            // Items List

           // var insList = await _inspectionItemsService.GetInspectionItemslListAsync(id);
           
            var mdl = _mapper.Map<VehicleinspectionItemViewModel>(model);            
            //model.CityId
           // var mapped = _mapper.Map<VehicleinspectionItemViewModel>(model);
            //mapped.inspectionItems= iList.ToList();

            return mdl;
        }

        public async Task<IEnumerable<VehicleinspectionItemViewModel>> GetVehicleInspectionsByVehicleAndStatusAsnc(int vehicleId, int status)
        {
            var list = await _vehicleInspectionService.GetVehiclesByVehicleIdAndStatusAsnc(vehicleId, status);
            var mapped = _mapper.Map<IEnumerable<VehicleinspectionItemViewModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<VehicleinspectionItemViewModel>> GetVehicleInspectionsAllFiltersAsync(VehicleinspectionItemViewModel model)
        {
            var mapped = _mapper.Map<VehicleinspectionModel>(model);
            var list = await _vehicleInspectionService.GetVehiclesAllFiltersAsync(mapped);
            var lst = _mapper.Map<IEnumerable<VehicleinspectionItemViewModel>>(list);
            return lst;
        }


        public async Task<VehicleinspectionItemViewModel> Create(VehicleinspectionItemViewModel vModel)
        {
            var mapped = _mapper.Map<VehicleinspectionModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _vehicleInspectionService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - VehicleInspectionPageService");

            var mappedViewModel = _mapper.Map<VehicleinspectionItemViewModel>(entityDto);
            return mappedViewModel;
        }
     

        public async Task Update(VehicleinspectionItemViewModel vmodel)
        {
            var mapped = _mapper.Map<VehicleinspectionModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _vehicleInspectionService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - VehicleInspectionPageService");
        }

        public async Task Delete(VehicleinspectionItemViewModel vmodel){
            var mapped = _mapper.Map<VehicleinspectionModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _vehicleInspectionService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - VehicleInspectionPageService");
        }
    }
}
