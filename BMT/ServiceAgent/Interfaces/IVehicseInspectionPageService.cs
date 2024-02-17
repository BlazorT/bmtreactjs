using com.blazor.bmt.viewmodels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.ui.interfaces
{
        public interface IVehicleInspectionPageService
    {
        Task<IEnumerable<VehicleinspectionItemViewModel>> GetVehicleInspectionsList();
        Task<VehicleinspectionItemViewModel> GetVehicleInspectionById(Int64 id);     
        Task<IEnumerable<VehicleinspectionItemViewModel>> GetVehicleInspectionsAllFiltersAsync(VehicleinspectionItemViewModel model);      
        Task<IEnumerable<VehicleinspectionItemViewModel>> GetVehicleInspectionsByVehicleAndStatusAsnc(int vehicleId, int status);
        //Task<VehicleinspectionItemViewModel> CreateInspectionReportWithItems(InspectionreportViewModel model);
        Task<VehicleinspectionItemViewModel> Create(VehicleinspectionItemViewModel model);
        Task Update(VehicleinspectionItemViewModel model);
        Task Delete(VehicleinspectionItemViewModel model);
    }
    }

