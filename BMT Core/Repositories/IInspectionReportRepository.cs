using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IInspectionReportRepository : IRepositoryTransaction<Inspectionreport>
    {
        Task<IEnumerable<Inspectionreport>> GetVehicleInspectionReportsListAsync();
        Task<Inspectionreport> GGetVehicleInspectionReportByIdSync(Int64 id);
        Task<IEnumerable<Inspectionreport>> GetVehicleINspectionReportsByVehicleIdAndStatusAsnc(Int64 vehicleId, int status);
        Task<IEnumerable<Inspectionreport>> GetVehicleReportsAllFiltersAsync(Inspectionreport model);

       
    }
}
