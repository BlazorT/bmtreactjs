using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IVehiclesRepository : IRepositoryTransaction<Vehicle>
    {
        Task<IEnumerable<Vehicle>> GetVehiclesListAsync();
        Task<Vehicle> GetVehicleByIdSync(Int64 Id);
        Task<IEnumerable<Vehicle>> GetVehiclesAllFiltersAsync(Vehicle model);
        Task<IEnumerable<Vehicle>> GetVehiclesByCategoryAndStatusAsnc(int categoryId, int status);
        Task<IEnumerable<Vehicle>> GetVehiclesByDspAndStatusAsnc(int dspId, int status);
        Task<IEnumerable<Vehicle>> GetVehiclesByNameAsync(string Name);
        Task<IEnumerable<Vehicle>> GetVehiclesByCategoryAsync(int categoryId);
    }
}
