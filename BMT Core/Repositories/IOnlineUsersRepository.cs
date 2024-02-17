using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositories
{
    public interface IOnlineUsersRepository  : IRepository<Onlineuser>
    {
        Task<IEnumerable<Onlineuser>> GetListByStatusAsync(int status, DateTime dtFrom, DateTime dtTo);       
        //Task<IEnumerable<OnlineUsers>> GetListByNameAsync(string name);
        Task<Onlineuser> GetOnlineUserByIdAsync(int userId);

    }
}
