using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IUsersRepository : IRepository<User>
    {
        Task<IEnumerable<User>> GetUsersListAsync();
        Task<User> GetUserByIdSync(Int32 Id);
        Task<IEnumerable<User>> GetUsersByNameAsync(string Name);
        Task<IEnumerable<User>> GetUsersByRoleAsync(int roleId, int dspId = 0);
        Task<IEnumerable<User>> GetUsersAllFiltersAsync(User model);
        Task<IEnumerable<User>> GetOrgUsersAllFiltersAsync(User model);
        Task<IEnumerable<User>> GetOrgMobileUsersAllFiltersAsync(User model);
    }
}
