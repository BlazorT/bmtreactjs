using com.blazor.bmt.application.model;
using com.blazor.bmt.util;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationModel>> GetNotificationList();
        Task<NotificationModel> GetNotificationById(long logId);
        Task<IEnumerable<NotificationModel>> GetNotificationDetails(NotificationModel AppLogModel);
        Task<IEnumerable<NotificationModel>> GetNotificationAllFiltersLogDetails(NotificationModel AppLogModel);
        Task<IEnumerable<NotificationModel>> InsertUpdateBulk(List<NotificationModel> nlst);
        Task<IEnumerable<NotificationModel>> GetNotificationBySearchKeyword(string keyword);
        Task<IEnumerable<NotificationModel>> GetNotificationByDateRangeAndStatus(STATUS_NOTIFICATION status, DateTime dtFrom, DateTime dtTo);
        Task<NotificationModel> Create(NotificationModel notificationModel);
        Task Update(NotificationModel notificationModel);
        Task Delete(NotificationModel notificationModel);
    }
}
