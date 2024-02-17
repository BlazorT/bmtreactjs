using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IVehiclesInspectionRepository : IRepositoryTransaction<Vehicleinspection>
    {
        Task<IEnumerable<Vehicleinspection>> GetVehicleInspectionsListAsync();
        Task<Vehicleinspection> GGetVehicleInspectionByIdSync(Int64 id);
        Task<IEnumerable<Vehicleinspection>> GetVehiclesByVehicleIdAndStatusAsnc(Int64 vehicleId, int status);
        Task<IEnumerable<Vehicleinspection>> GGetVehicleInspectionByReportIdSync(Int64 Reportid);
        Task<IEnumerable<Vehicleinspection>> GetVehiclesAllFiltersAsync(Vehicleinspection model);
        Task<IEnumerable<Vehicleinspection>> bulkaddorupdates(List<Vehicleinspection> ls);

    }
}
