using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class OrgPackageDetailRepository : RepositoryTransaction<Orgpackagedetail>, IOrgPackageDetailRepository
    {
        public OrgPackageDetailRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Orgpackagedetail>> GetOrgPackageDetailsBynetworkAndOrgAsync(int networkid, int orgid)
        {
            return await _dbContext.Orgpackagedetails.AsNoTracking()
               .Where(x => x.NetworkId == (networkid == 0? x.NetworkId : networkid) && x.OrgId == (orgid == 0 ? x.OrgId : orgid))
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
       
        public async Task<IEnumerable<Orgpackagedetail>> GetOrgPackageDetailByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Orgpackagedetails.AsNoTracking()
               .Where(x => x.Name.ToLower().Contains(name.ToLower())).OrderBy(x => x.Name)
                .ToListAsync();
           
        }
        public async Task<IEnumerable<Orgpackagedetail>> GetOrgPackageDetailsAllFiltersAsync(Orgpackagedetail model)
        {
            return await _dbContext.Orgpackagedetails.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.NetworkId == (model.NetworkId == 0 ? x.NetworkId : model.NetworkId) && x.OrgId == (model.OrgId == 0 ? x.OrgId : model.OrgId) && x.Name.Contains((""+ model.Name)) && x.Status == (model.Status == 0 ? x.Status : model.Status))// && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt) &&  x.Name.Contains(""+model.Name) ).OrderBy(x => x.Name)
                .ToListAsync();
        }
        public async Task<Orgpackagedetail> GetOrgPackageDetailseAsync(Int64 id)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Orgpackagedetails.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }

    }
}
