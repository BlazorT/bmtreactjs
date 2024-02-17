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
using com.blazor.bmt.application.services;
using com.blazor.bmt.util;

namespace com.blazor.bmt.ui.services
{
    public class InspectionReportPageService : IInspectionReportPageService
    {
        private readonly IInspectionReportService _InspectionReportService;
        private readonly IVehicleInspectionService  _vehicleInspectionService;
        //private readonly ICategoryService _categoryAppService;
        private readonly IMapper _mapper;
        private readonly ILogger<InspectionReportPageService> _logger;

        public InspectionReportPageService(IInspectionReportService InspectionReportService, IVehicleInspectionService vehicleInspectionService, IMapper mapper, ILogger<InspectionReportPageService> logger)
        {
            _InspectionReportService = InspectionReportService ?? throw new ArgumentNullException(nameof(InspectionReportService));
            _vehicleInspectionService = vehicleInspectionService ?? throw new ArgumentNullException(nameof(vehicleInspectionService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<InspectionreportViewModel>> GetVehicleInspectionReportsList() {          
            var list = await _InspectionReportService.GetVehicleInspectionReportsListAsync();
            var mapped = _mapper.Map<IEnumerable<InspectionreportViewModel>>(list);
            return mapped;

        }
     
  
        public async Task<InspectionreportViewModel> GetVehicleInspectionReportById(Int64 id)
        {
            var model = await _InspectionReportService.GetVehicleInspectionReportByIdSync(id);
            // Items List

            var insList = await _vehicleInspectionService.GGetVehicleInspectionByReportIdSync(id);

            var iList = _mapper.Map < IEnumerable <VehicleinspectionItemViewModel>>(insList);            
            //model.CityId
            var mapped = _mapper.Map<InspectionreportViewModel>(model);
            mapped.inspectionItems= iList.ToList();

            return mapped;
        }

        public async Task<IEnumerable<InspectionreportViewModel>> GetVehicleInspectionReportsByVehicleAndStatusAsnc(int vehicleId, int status)
        {
            var list = await _InspectionReportService.GetVehicleInspectionsByVehicleIdAndStatusAsnc(vehicleId, status);
            var mapped = _mapper.Map<IEnumerable<InspectionreportViewModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<InspectionreportViewModel>> GetVehicleInspectionReportsAllFiltersAsync(InspectionreportViewModel model)
        {
            var mapped = _mapper.Map<InspectionreportModel>(model);
            var list = await _InspectionReportService.GetVehicleInspectionsAllFiltersAsync(mapped);
            var lst = _mapper.Map<IEnumerable<InspectionreportViewModel>>(list);
            return lst;
        }
        public async Task<InspectionreportViewModel> UpdateInspectionReportWithItems(InspectionreportViewModel model)
        {
            var mapped = _mapper.Map<InspectionreportModel>(model);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

             await _InspectionReportService.Update(mapped);

            if (model.Id > 0 && model.inspectionItems != null && model.inspectionItems.Any())
            {
                List<VehicleinspectionModel> ls = new List<VehicleinspectionModel>();
                foreach (VehicleinspectionItemViewModel vItem in model.inspectionItems)
                {
                    ls.Add(new VehicleinspectionModel { Id = vItem.Id, InspectionItemId = vItem.InspectionItemId, Found = vItem.Found, InspectionReportId = vItem.InspectionReportId, Status = vItem.Status, Vehicleid = vItem.Vehicleid,  CreatedAt = GlobalUTIL.CurrentDateTime, CreatedBy = Convert.ToInt32(vItem.CreatedBy), LastUpdatedBy = Convert.ToInt32(vItem.CreatedBy), LastUpdatedAt = vItem.LastUpdatedAt, Remarks = vItem.Remarks });
                }
                await _vehicleInspectionService.BulkAddorUpdates(ls);

            }
            _logger.LogInformation($"Entity successfully added - inspectionReportService");

            var mappedViewModel = _mapper.Map<InspectionreportViewModel>(model);
            return mappedViewModel;
        }
        public async Task<InspectionreportViewModel> CreateInspectionReportWithItems(InspectionreportViewModel model)
        {
            var mapped = _mapper.Map<InspectionreportModel>(model);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _InspectionReportService.Create(mapped);

            if (entityDto != null && model.inspectionItems != null && model.inspectionItems.Any())
            {
                List<VehicleinspectionModel> ls = new List<VehicleinspectionModel>();
                foreach (VehicleinspectionItemViewModel vItem in model.inspectionItems)
                {
                    ls.Add(new VehicleinspectionModel { Id = 0, InspectionItemId = vItem.InspectionItemId, Found = vItem.Found, InspectionReportId = entityDto.id, Status = vItem.Status, Vehicleid = vItem.Vehicleid, CreatedAt = GlobalUTIL.CurrentDateTime, CreatedBy = Convert.ToInt32(vItem.CreatedBy), LastUpdatedBy = Convert.ToInt32(vItem.CreatedBy), LastUpdatedAt = vItem.LastUpdatedAt, Remarks = vItem.Remarks });
                }
                await _vehicleInspectionService.BulkAddorUpdates(ls);

            }
            _logger.LogInformation($"Entity successfully added - inspectionReportService");

            var mappedViewModel = _mapper.Map<InspectionreportViewModel>(entityDto);
            return mappedViewModel;
        }
        public async Task<InspectionreportViewModel> Create(InspectionreportViewModel vModel)
        {
            var mapped = _mapper.Map<InspectionreportModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _InspectionReportService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - InspectionReportPageService");

            var mappedViewModel = _mapper.Map<InspectionreportViewModel>(entityDto);
            return mappedViewModel;
        }

        public async Task Update(InspectionreportViewModel vmodel)
        {
            var mapped = _mapper.Map<InspectionreportModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _InspectionReportService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - InspectionReportPageService");
        }

        public async Task Delete(InspectionreportViewModel vmodel){
            var mapped = _mapper.Map<InspectionreportModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _InspectionReportService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - InspectionReportPageService");
        }
    }
}
