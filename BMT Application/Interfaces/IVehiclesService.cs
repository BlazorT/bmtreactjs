using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IVehiclesService
    {
        Task<IEnumerable<VehicleModel>> GetVehiclesList();
        Task<VehicleModel> GetVehicleById(Int64 id);
        Task<IEnumerable<VehicleModel>> GetVehiclesByName(string productName);
        Task<IEnumerable<VehicleModel>> GetVehiclesAllFiltersAsync(VehicleModel model);
        Task<IEnumerable<VehicleModel>> GetVehiclesByDspAndStatusAsnc(int dspId, int status);
        Task<IEnumerable<VehicleModel>> GetVehiclesByCategoryAndStatusAsnc(int categoryId, int status);
        Task<VehicleModel> Create(VehicleModel model);
        Task Update(VehicleModel model);
        Task Delete(VehicleModel model);
    }
}
