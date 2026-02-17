using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface INotificationsRepository : IRepositoryTransaction<Notification>
    {
        Task<IEnumerable<Notification>> GetNotificationsListAsync();
        Task<Notification> GetNotificationByIdSync(Int64 id);
        Task<IEnumerable<Notification>> GetNotificationsAllFiltersAsync(Notification model);
        Task<IEnumerable<Notification>> GetNotificationsLogAllFiltersAsync(Notification model);
        Task<IEnumerable<Notification>> GetNotificationsByCategoryAndStatusAsnc(int showRoomId, int status);
        Task<IEnumerable<Notification>> InsertUpdateBulk(List<Notification> nlst);
        Task<IEnumerable<Notification>> GetNotificationsByNameAsync(string keyword);
        Task<IEnumerable<Notification>> GetNotificationsByCategoryAsync(int showRoomId);
    }
}
