using com.blazor.dsps.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.dsps.application.interfaces
{
    public interface IOnlineUsersService
    {
        Task<IEnumerable<OnlineuserModel>> GetListByStatusAsync(int status, DateTime dtFrom, DateTime dtTo);
        //Task<OnlineUserModel> loggedIn(OnlineUserModel usr, string remoteMachineIp);
        Task<OnlineuserModel> GetOnlineUserByIdAsync(int userId);
        Task<OnlineuserModel> Create(OnlineuserModel onlineUsersModel);
        Task Update(OnlineuserModel onlineUsersModel);


    }
}
