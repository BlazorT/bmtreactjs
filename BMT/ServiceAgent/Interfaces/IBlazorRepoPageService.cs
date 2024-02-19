using com.blazor.bmt.viewmodels;
using Microsoft.AspNetCore.Mvc;

namespace com.blazor.bmt.ui.interfaces
{
    public interface IBlazorRepoPageService
    {
       // Task<IEnumerable<VehicleViewModel>> GetVehiclesAllAsync(VehicleViewModel vModel);      
        Task<IEnumerable<ReportViewModel>> GetUsersReportData(ReportViewModel resportViewmodel);
        Task<IEnumerable<ReportViewModel>> GetVehiclesReportData(ReportViewModel resportViewmodel);       
        Task<BlazorApiResponse> UpdateGlobalSettings(BasicConfigurationViewModel model);
       // Task<BlazorResponseViewModel> GetInventoryDetailedDataData(Inventorydetailviewmodel resportViewmodel);
        Task<BlazorResponseViewModel> GetUsersReportData(UserViewModel model);
       // Task<BlazorResponseViewModel> GetDispatchmentofProductsAndVehiclesData(DispatchmentViewModel model);
       // Task<BlazorResponseViewModel> GetRosterFleetsData(RosterplanViewModel model);
       // Task<BlazorResponseViewModel> GetVehicleInspectionsData(InspectionreportViewModel model);
       // Task<BlazorResponseViewModel> GetVehicleDetailedData(VehicleViewModel model);
        Task<IEnumerable<AppLogViewModel>> GetLogDetailsData(AppLogViewModel vmdl);
        Task<IEnumerable<AuditLogViewModel>> GetAuditLogDetailsData(AuditLogViewModel vmdl);
       // Task<BlazorResponseViewModel> GetDSPDetailedData(DspViewModel model);
        Task<BlazorResponseViewModel> GetDADetailsData(UserViewModel umdl);    
       // Task<VehicleViewModel> GetVehicleDetailsByIDAync(Int64 Id);
        Task<IEnumerable<MenuViewModel>> loadRoleMenus(int roleid);
        Task<BlazorResponseViewModel> AddUpdateRoleRights(List<RolerightViewModel> vLst);
      //  Task<BlazorResponseViewModel> updateDispatchments([FromBody] List<DispatchmentCustomViewMode> dlst);
       // Task<BlazorResponseViewModel> UpdateDADispatchments([FromBody] List<DispatchmentViewModel> dlst);
        Task<LoginViewModel> GetUserVerificationData(LoginViewModel model);
        Task<List<object>> GetDashboardData(int showroomId);

    }
}

