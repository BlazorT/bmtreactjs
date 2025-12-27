using com.blazor.bmt.core;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.util;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class OrglicensingRepository : RepositoryTransaction<Orglicensing>, IOrglicensingRepository
    {
        public OrglicensingRepository(_bmtContext dbContext) : base(dbContext)
        {

        }
      
        public async Task<Orglicensing> GetOrglicensingByIdAsync(Int64 id)
        {
            return await _dbContext.Orglicensings.AsNoTracking()
                     .Where(x => (x.Id== id ))
                     .FirstOrDefaultAsync();
        }
       
        public async Task<IEnumerable<Orglicensing>> GetOrglicensingByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Orglicensings
               .Where(x => x.Name.ToLower().Contains(name.ToLower()) || x.Accesskey.ToLower().Contains(name.ToLower()))
                .ToListAsync();
        }
        public async Task<IEnumerable<Orglicensing>> GetOrglicensingsBynetworkAndOrgAsync(int orgId,int networkid)
        {
            return await _dbContext.Orglicensings
               .Where(x => x.NetworkId == networkid && x.OrgId == orgId)
                .ToListAsync();
        }
       
        public async Task<IEnumerable<Orglicensing>> GetOrglicensingsAllFiltersAsync(Orglicensing model)
        {

            return await _dbContext.Orglicensings.AsNoTracking()
               .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && (x.OrgId == (Convert.ToInt32(model.OrgId) == 0 ? x.OrgId : model.OrgId)) && (x.Status == (model.Status == 0 ? x.Status : model.Status) && x.NetworkId == (Convert.ToInt32(model.NetworkId) == 0 ? x.NetworkId : model.NetworkId)) && x.Name.Contains("" + model.Name) && x.CreatedAt >= (model.CreatedAt.Year<= 1900? x.CreatedAt:model.CreatedAt))
                .ToListAsync();

        }


    }
}
