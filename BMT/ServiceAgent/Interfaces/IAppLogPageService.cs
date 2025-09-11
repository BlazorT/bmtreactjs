using Blazor.Web.ViewModels;
using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.UI.Interfaces
{
    public interface IAppLogPageService
    {
        Task<IEnumerable<AppLogViewModel>> GetAppLogs(string keyword);
        Task<IEnumerable<AppLogViewModel>> GetAppLogs();
        Task<AppLogViewModel> GetAppLogById(long logId);
        Task<IEnumerable<AppLogViewModel>> GetAppLogByUser(int userId);       
        Task CreateAppLog(AppLogViewModel AppLogViewModel);
        Task<AppLogViewModel> GetAppLogByAllFilters(AppLogViewModel vmodel);
        Task ProcessLoginActivity(int UserId,int OrgId, LOGIN_ACTIVITY activity, string remoteMachineIp);
        Task UpdateAppLog(AppLogViewModel AppLogViewModel);
        Task DeleteAppLog(AppLogViewModel AppLogViewModel);
    }
}
