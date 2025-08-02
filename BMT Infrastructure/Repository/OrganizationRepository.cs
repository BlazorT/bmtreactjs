using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class OrganizationRepository : Repository<Organization>, IOrganizationRepository
    {
        public OrganizationRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Organization>> GetOrgListByStatusAsync(int status)
        {
            return await _dbContext.Organizations.AsNoTracking()
               .Where(x => x.Status== (status==0? x.Status: status))
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
       
        public async Task<IEnumerable<Organization>> GetOrgByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Organizations.AsNoTracking()
               .Where(x => x.Name.ToLower().Contains(name.ToLower())).OrderBy(x => x.Name)
                .ToListAsync();
           
        }
        public async Task<IEnumerable<Organization>> GetOrgAllFiltersAsync(Organization model)
        {
            return await _dbContext.Organizations.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.Contact.Contains((""+ model.Contact)) && x.Status == (model.Status == 0 ? x.Status : model.Status))// && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt) &&  x.Name.Contains(""+model.Name) ).OrderBy(x => x.Name)
                .ToListAsync();
        }
        public async Task<Organization> GetOrgByIDeAsync(Int32 id)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Organizations.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }

    }
}
