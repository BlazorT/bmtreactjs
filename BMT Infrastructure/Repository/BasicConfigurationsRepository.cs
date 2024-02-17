using com.blazor.bmt.core;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.util;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using Blazor.Web.UTIL;
namespace com.blazor.bmt.infrastructure.repositories
{
    public class BasicConfigurationsRepository : Repository<Basicconfiguration>, IBasicConfigurationsRepository
    {
        public BasicConfigurationsRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Basicconfiguration>> GetListByStatusAsync(int status)
        {
            return await _dbContext.Basicconfigurations.AsNoTracking()
               .Where(x => x.Status == (status == 0 ? x.Status : status))
                .ToListAsync();

            // second way
            // return await GetAllAsync(); 
        }
        
public async Task<Basicconfiguration> GetListByDspAndKeyAsync(string key)
        {
            return await _dbContext.Basicconfigurations.AsNoTracking()
              // .Where(x => x.k == key && x.Status==1)
                .FirstOrDefaultAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<Basicconfiguration> GetBasicConfigurationsByIdAsync(int configurationId)
        {
            return await _dbContext.Basicconfigurations.AsNoTracking()
               .Where(x => x.Id == (configurationId == 0 ? x.Id : configurationId))
                .FirstOrDefaultAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<IEnumerable<Basicconfiguration>> GetListByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Basicconfigurations.AsNoTracking()
               .Where(x => x.SmtpServer.ToLower().Contains(name.ToLower()) && x.Status==(int)UTIL.COMMON_STATUS.ACTIVE)
                .ToListAsync();
           
        }
        public async Task<Basicconfiguration> GetBasicConfigurationByKeyAsync(string key)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Basicconfigurations.AsNoTracking()
               .Where(x =>  x.Status == (int)UTIL.COMMON_STATUS.ACTIVE)
                .FirstOrDefaultAsync();

        }

    }
}
