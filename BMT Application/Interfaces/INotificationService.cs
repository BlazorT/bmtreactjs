using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationModel>> GetNotificationList();
        Task<NotificationModel> GetNotificationById(Int64 id);
        Task<IEnumerable<NotificationModel>> GetNotificationsByName(string productName);
        Task<IEnumerable<NotificationModel>> GetNotificationsAllFiltersAsync(NotificationModel model);
        
        Task<IEnumerable<NotificationModel>> GetNotificationsByCategoryAndStatusAsnc(int showRoomId, int status);
        Task<NotificationModel> Create(NotificationModel model);
        Task Update(NotificationModel model);
        Task Delete(NotificationModel model);
    }
}
