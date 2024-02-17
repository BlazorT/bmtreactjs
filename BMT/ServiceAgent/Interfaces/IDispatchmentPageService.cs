using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.interfaces
{
        public interface IDispatchmentPageService
    {      
        Task<IEnumerable<DispatchmentViewModel>> GetDispatchmentByVehicleIdAndStatusAsynch(Int64 vehicleId, int status );
        Task<IEnumerable<DispatchmentViewModel>> GetDispatchmentsAllAsync(DispatchmentViewModel model);
        Task<DispatchmentViewModel> GetDispatchmentById(Int64 id);
        Task<DispatchmentViewModel> Create(DispatchmentViewModel vModel);
        Task<IEnumerable<DispatchmentViewModel>> AddUpdateBulkDispatchments(List<DispatchmentViewModel> vlst);
        Task Update(DispatchmentViewModel model);
        Task Delete(DispatchmentViewModel model);
    }
 }

