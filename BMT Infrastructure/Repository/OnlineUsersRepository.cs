using com.blazor.bmt.core;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace com.blazor.bmt.infrastructure.repositories
{
    public class OnlineUsersRepository : Repository<Onlineuser>, IOnlineUsersRepository
    {
        public OnlineUsersRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Onlineuser>> GetListByStatusAsync(int status, DateTime dtFrom, DateTime dtTo)
        {
            return await _dbContext.Onlineusers.AsNoTracking()
               .Where(x => x.Status== (status==0? x.Status: status) && x.LoginTime >= dtFrom && x.LoginTime <= dtTo)
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
       
        public async Task<Onlineuser> GetOnlineUserByIdAsync(int userId)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Onlineusers.AsNoTracking()
               .Where(x => x.UserId == (userId == 0 ? x.UserId : userId))
                .FirstOrDefaultAsync();
           
        }

    }
}
