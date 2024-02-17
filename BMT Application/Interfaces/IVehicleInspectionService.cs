using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IVehicleInspectionService
    {
        Task<IEnumerable<VehicleinspectionModel>> GetVehicleInspectionsListAsync();
        Task<VehicleinspectionModel> GGetVehicleInspectionByIdSync(Int64 id);
        Task<IEnumerable<VehicleinspectionModel>> GGetVehicleInspectionByReportIdSync(Int64 Reportid);
        Task<IEnumerable<VehicleinspectionModel>> GetVehiclesByVehicleIdAndStatusAsnc(Int64 vehicleId, int status);
        Task<IEnumerable<VehicleinspectionModel>> GetVehiclesAllFiltersAsync(VehicleinspectionModel model);
        Task<IEnumerable<VehicleinspectionModel>> BulkAddorUpdates(List<VehicleinspectionModel> ls);
        Task<VehicleinspectionModel> Create(VehicleinspectionModel model);
        Task Update(VehicleinspectionModel model);
        Task Delete(VehicleinspectionModel model);
    }
}
