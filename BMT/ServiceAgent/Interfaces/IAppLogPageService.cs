using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.interfaces
{
    public interface IAppLogPageService
    {
        Task<IEnumerable<AppLogViewModel>> GetAppLogs(string keyword);
        Task<IEnumerable<AppLogViewModel>> GetAppLogs();
        Task<AppLogViewModel> GetAppLogById(long logId);
        Task<IEnumerable<AppLogViewModel>> GetAppLogByUser(int userId);       
        Task CreateAppLog(AppLogViewModel appLogViewModel);
        Task ProcessLoginActivity(int UserId, UTIL.LOGIN_ACTIVITY activity, string remoteMachineIp);
        Task UpdateAppLog(AppLogViewModel appLogViewModel);
        Task DeleteAppLog(AppLogViewModel appLogViewModel);
    }
}
