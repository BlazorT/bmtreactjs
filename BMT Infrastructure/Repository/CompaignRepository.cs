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
    public class CompaignRepository : RepositoryTransaction<Compaign>, ICompaignRepository
    {
        public CompaignRepository(_bmtContext dbContext) : base(dbContext)
        {

        }
        
        //Task<Compaign> GetCompaignByStatusAsync(Blazor.Web.UTIL.COMPAIGNS_STATUS stats);
 
        public async Task<IEnumerable<Compaign>> GetCompaignListAsync()
        {
            return await _dbContext.Compaigns             
               .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
       
        public async Task<IEnumerable<Compaign>> GetCompaignsByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Compaigns
               .Where(x => x.Title.ToLower().Contains(name.ToLower()) || x.Description.Contains(name)).OrderByDescending(x=>x.LastUpdatedAt)
                .ToListAsync();
            // second way
            // return await GetAsync(x => x.ProductName.ToLower().Contains(productName.ToLower()));

            // third way
            //return await _dbContext.Products
            //    .Where(x => x.ProductName.Contains(productName))
            //    .ToListAsync();
        }
        public async Task<IEnumerable<Compaign>> GetCompaignsByOrganizationAsync(int orgId)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Compaigns
               .Where(x => x.OrgId== orgId)
                .ToListAsync();            
        }
        public async Task<Compaign> GetCompaignByIdAsync(Int64 id)
        {
            return await _dbContext.Compaigns.AsNoTracking()
               .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
           
        }
        public async Task<Compaign> GetCompaignByStatusAsync(int status)
        {
            return await _dbContext.Compaigns
               .Where(x => x.Status == (int)status)
                .FirstOrDefaultAsync();

        }

        public async Task<IEnumerable<Compaign>> GetCompaignByAllFiltersAsync(Compaign compaign)
        {
           
            return await _dbContext.Compaigns.AsNoTracking()
               .Where(x => x.Id == compaign.Id || x.Status== compaign.Status ).OrderByDescending(x => x.LastUpdatedAt)
                .ToListAsync();
           
        }
       
    }
}
