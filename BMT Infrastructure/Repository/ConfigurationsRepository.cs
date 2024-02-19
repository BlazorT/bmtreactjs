using com.blazor.bmt.core;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.util;
using com.blazor.dsps.core.repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using Blazor.Web.UTIL;
namespace com.blazor.bmt.infrastructure.repositories
{
    public class ConfigurationsRepository : Repository<Configuration>, IConfigurationsRepository
    {
        public ConfigurationsRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Configuration>> GetListByStatusAsync(int status)
        {
            return await _dbContext.Configurations.AsNoTracking()
               .Where(x => x.Status == (status == 0 ? x.Status : status))
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<IEnumerable<Configuration>> getConfigurationListAsyncByDSP(int Id)
        {
            return await _dbContext.Configurations.AsNoTracking()
               .Where(x => x.OrganizationId == (Id == 0 ? x.OrganizationId : Id))
                .ToListAsync();
        }
        public async Task<Configuration> GetListByDspAndKeyAsync(int DspId, string key)
        {
            return await _dbContext.Configurations.AsNoTracking()
               .Where(x => x.OrganizationId == DspId && x.Key.Contains(key) && x.Status==1)
                .FirstOrDefaultAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<Configuration> GetConfigurationsByIdAsync(int configurationId)
        {
            return await _dbContext.Configurations.AsNoTracking()
               .Where(x => x.Id == (configurationId == 0 ? x.Id : configurationId))
                .FirstOrDefaultAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<IEnumerable<Configuration>> GetListByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Configurations.AsNoTracking()
               .Where(x => x.Name.ToLower().Contains(name.ToLower()) && x.Status==(int)UTIL.COMMON_STATUS.ACTIVE)
                .ToListAsync();
           
        }
        public async Task<Configuration> GetConfigurationByKeyAsync(string key)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Configurations.AsNoTracking()
               .Where(x => x.Key.ToLower().Contains(key.ToLower()) && x.Status == (int)UTIL.COMMON_STATUS.ACTIVE)
                .FirstOrDefaultAsync();

        }

    }
}
