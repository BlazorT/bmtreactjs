using com.blazor.bmt.viewmodels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.ui.interfaces
{
        public interface IInspectionReportPageService
    {
        Task<IEnumerable<InspectionreportViewModel>> GetVehicleInspectionReportsList();
        Task<InspectionreportViewModel> GetVehicleInspectionReportById(Int64 id);     
        Task<IEnumerable<InspectionreportViewModel>> GetVehicleInspectionReportsAllFiltersAsync(InspectionreportViewModel model);      
        Task<IEnumerable<InspectionreportViewModel>> GetVehicleInspectionReportsByVehicleAndStatusAsnc(int vehicleId, int status);
        Task<InspectionreportViewModel> CreateInspectionReportWithItems(InspectionreportViewModel model);
        Task<InspectionreportViewModel> UpdateInspectionReportWithItems(InspectionreportViewModel model);
       
        Task<InspectionreportViewModel> Create(InspectionreportViewModel model);
        Task Update(InspectionreportViewModel model);
        Task Delete(InspectionreportViewModel model);
    }
    }

