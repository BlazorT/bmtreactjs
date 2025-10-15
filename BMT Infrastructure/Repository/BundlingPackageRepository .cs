
using Blazor.Web.Core.Repositories;
using Blazor.Web.ViewModels;
using com.blazor.bmt.core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class BundlingPackageRepository : RepositoryTransaction<Bundlingpackagedetail>, IBundlingPackageRepository
    {
        public BundlingPackageRepository(_bmtContext dbContext) : base(dbContext)
        {

        }      

        public async Task<IEnumerable<Bundlingpackagedetail>> GetBundlingPackagesListByStatusAsync(int status)
        {
            return await _dbContext.Bundlingpackagedetails.AsNoTracking()
               .Where(x => x.Status== (status==0? x.Status: status))
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
       
     
        public async Task<Bundlingpackagedetail> GetBundlingPackageByIdAsync(Int64 id)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Bundlingpackagedetails.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }
         public async Task<IEnumerable<Bundlingpackagedetail>> GetBundlingPackageByNetworkIdAsync(int networkId)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Bundlingpackagedetails.AsNoTracking()
               .Where(x => x.NetworkId== (networkId==0? x.NetworkId: networkId) && x.Status==1)
                .ToListAsync();

        }
        public async Task<IEnumerable<Bundlingpackagedetail>> GetBundlingPackageAllFiltersAsync(int networkId, int status=0)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Bundlingpackagedetails.AsNoTracking()
               .Where(x => x.NetworkId == (networkId == 0 ? x.NetworkId : networkId) && x.Status == (status==0? x.Status: status))
                .ToListAsync();

        }


    }
}
