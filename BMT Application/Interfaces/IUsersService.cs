using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IUsersService
    {
        Task<IEnumerable<UserModel>> GetUsersList();
        Task<UserModel> GetUsersById(int id);
        Task<IEnumerable<UserModel>> GetUsersByName(string productName);
        Task<IEnumerable<UserModel>> GetMobileUsersByAllFiltersAsync(UserModel model);
        Task<IEnumerable<UserModel>> GetUsersByDspAndRole(int roleId, int dspId = 0);
        Task<IEnumerable<UserModel>> GetAllUsersList(UserModel model);
        Task<IEnumerable<UserModel>> GetAllDspUsersList(UserModel model);
        Task<UserModel> Create(UserModel model);
        Task<UserModel> GetUserByEmailORLoginnameSync(string EmailOrLogin, string SecurityCode);
        Task Update(UserModel model);
        Task Delete(UserModel model);
    }
}
