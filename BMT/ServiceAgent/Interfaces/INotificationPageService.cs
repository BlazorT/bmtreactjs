using com.blazor.bmt.application.model;
using com.blazor.bmt.viewmodels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.ui.interfaces
{
        public interface INotificationPageService
    {
        Task<IEnumerable<NotificationViewModel>> GetNotificationList();
        Task<NotificationViewModel> GetNotificationById(Int64 id);
        Task<IEnumerable<NotificationViewModel>> GetNotificationsByName(string keyword);
        Task<IEnumerable<NotificationViewModel>> GetNotificationsAllFiltersAsync(NotificationViewModel model);

        Task<IEnumerable<NotificationViewModel>> GetNotificationsByCategoryAndStatusAsnc(int showRoomId, int status);
        Task<OnlineuserModel> loggedIn(LoginViewModel usr, string remoteMachineIp);
        Task<OnlineuserModel> loggedOut(string remoteMachineIp, int userId);
        Task<NotificationViewModel> Create(NotificationViewModel model);
        Task Update(NotificationViewModel model);
        Task Delete(NotificationViewModel model);
    }
    }

