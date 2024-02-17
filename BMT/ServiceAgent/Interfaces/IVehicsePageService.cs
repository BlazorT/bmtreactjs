using com.blazor.bmt.viewmodels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.ui.interfaces
{
        public interface IVehiclesPageService
    {
        Task<IEnumerable<VehicleViewModel>> GetVehiclesList();
        Task<VehicleViewModel> GetVehicleById(Int64 id);
        Task<IEnumerable<VehicleViewModel>> GetVehiclesByName(string productName);
        Task<IEnumerable<VehicleViewModel>> GetVehiclesAllFiltersAsync(VehicleViewModel model);
        Task<IEnumerable<VehicleViewModel>> GetVehicleImages(Int64 vehicleId);
        Task<IEnumerable<VehicleViewModel>> GetVehiclesByCategoryAndStatusAsnc(int categoryId, int status);
        Task<IEnumerable<VehicleViewModel>> GetVehiclesByDSPAndStatusAsnc(int dspId, int status);
        Task<VehicleViewModel> Create(VehicleViewModel model);
        Task Update(VehicleViewModel model);
        Task Delete(VehicleViewModel model);
    }
    }

