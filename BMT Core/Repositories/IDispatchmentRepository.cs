using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IDispatchmentRepository : IRepositoryTransaction<Dispatchment>
    {       
        Task<Dispatchment> GetDispatchmentByIdSync(Int64 id);
        Task<IEnumerable<Dispatchment>> GetDispatchmentsByVehicleIdAndStatusAsnc(Int64 VehileId, int status);
        Task<IEnumerable<Dispatchment>> bulkaddorupdates(List<Dispatchment> ls);
        Task<IEnumerable<Dispatchment>> GetDispatchmentsAllFiltersAsync(Dispatchment model);

       
    }
}
