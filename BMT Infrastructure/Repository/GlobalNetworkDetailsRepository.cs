using com.blazor.bmt.core;
using com.blazor.bmt.core.repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class GlobalNetworkDetailsRepository : RepositoryTransaction<Globalnetworkdetail>, IGlobalNetworkDetailsRepository
    {
        public GlobalNetworkDetailsRepository(_bmtContext dbContext) : base(dbContext)
        {

        }     
        public async Task<IEnumerable<Globalnetworkdetail>> GetGlobalNetworkDetailListByStatusAsync(int status)
        {
            return await _dbContext.Globalnetworkdetails.AsNoTracking()
               .Where(x => x.Status== (status==0? x.Status: status))
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
       
     
        public async Task<Globalnetworkdetail> GetGlobalNetworkDetailByIdAsync(Int64 id)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Globalnetworkdetails.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }
         public async Task<IEnumerable<Globalnetworkdetail>> GetGlobalNetworkDetailByNetworkIdAsync(int networkId)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Globalnetworkdetails.AsNoTracking()
               .Where(x => x.NetworkId== networkId)
                .ToListAsync();

        }
       

    }
}
