using com.blazor.bmt.application.model;
using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;
namespace Blazor.Web.UI.Interfaces
{
    public interface INotificationPageService
    {


        Task<IEnumerable<NotificationViewModel>> GetNotificationList();
        Task<NotificationViewModel> GetNotificationById(long notificationId);
        Task<IEnumerable<NotificationViewModel>> GetNotificationDetails(NotificationViewModel notificationViewModel);

        //Task<IEnumerable<NotificationModel>> GetNotificationByUserId(int userId);
        Task<IEnumerable<NotificationViewModel>> GetNotificationBySearchKeyword(string keyword);
        Task<IEnumerable<NotificationViewModel>> GetNotificationByDateRangeAndStatusAsync(STATUS_NOTIFICATION status,System.DateTime dtFrom, System.DateTime dtTo);
        Task<OnlineuserModel> loggedIn(UserViewModel usr, string remoteMachineIp);
        Task<OnlineuserModel> loggedOut(string remoteMachineIp, int userId);
        Task<NotificationViewModel> CreateNotification(NotificationViewModel notificationViewModel);
        
        Task UpdateNotification(NotificationViewModel notificationViewModel);
        Task DeleteNotification(NotificationViewModel notificationViewModel);
    }
}
