using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IDispatchmentService
    {       
        Task<DispatchmentModel> GetDispatchmentsByIdSync(Int64 id);
        Task<IEnumerable<DispatchmentModel>> GetDispatchmentsByVehicleIdAndStatusAsnc(Int64 vehicleId, int status);
        Task<IEnumerable<DispatchmentModel>> GetDispatchmentsAllFiltersAsync(DispatchmentModel model);
        Task<IEnumerable<DispatchmentModel>> BulkAddorUpdates(List<DispatchmentModel> ls);
        Task<DispatchmentModel> Create(DispatchmentModel model);
        Task Update(DispatchmentModel model);
        Task Delete(DispatchmentModel model);
    }
}
