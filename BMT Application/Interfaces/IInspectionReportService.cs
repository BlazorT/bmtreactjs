using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IInspectionReportService
    {
        Task<IEnumerable<InspectionreportModel>> GetVehicleInspectionReportsListAsync();
        Task<InspectionreportModel> GetVehicleInspectionReportByIdSync(Int64 id);
        Task<IEnumerable<InspectionreportModel>> GetVehicleInspectionsByVehicleIdAndStatusAsnc(Int64 vehicleId, int status);
        Task<IEnumerable<InspectionreportModel>> GetVehicleInspectionsAllFiltersAsync(InspectionreportModel model);
        Task<InspectionreportModel> Create(InspectionreportModel model);
        Task Update(InspectionreportModel model);
        Task Delete(InspectionreportModel model);
    }
}
