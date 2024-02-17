using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class IntegrationRepository : Repository<Integrationservicesetting>, IIntegrationRepository
    {
        public IntegrationRepository(_bmtContext dbContext) : base(dbContext)
        {

        }    
        public async Task<IEnumerable<Integrationservicesetting>> GetIntegrationserviceListByStatusAsync(int status)
        {
            return await _dbContext.Integrationservicesettings.AsNoTracking()
               .Where(x => x.Status== (status==0? x.Status: status))
                .ToListAsync();
        }
       
        public async Task<IEnumerable<Integrationservicesetting>> GetIntegrationserviceByNameAsync(string name)
        {    
            return await _dbContext.Integrationservicesettings.AsNoTracking()
               .Where(x => x.Name.ToLower().Contains(name.ToLower())).OrderBy(x => x.Name)
                .ToListAsync();
           
        }
        public async Task<IEnumerable<Integrationservicesetting>> GetIntegrationserviceAllFiltersAsync(Integrationservicesetting model)
        {
            return await _dbContext.Integrationservicesettings.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.Contact.Contains((""+ model.Contact)) && x.Status == (model.Status == 0 ? x.Status : model.Status) && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt) &&  x.Name.Contains(""+model.Name) && x.ServiceUri.Contains("" + model.ServiceUri)).OrderBy(x => x.Name)
                .ToListAsync();
        }
        public async Task<Integrationservicesetting> GetByIdAsync(Int32 id)
        {           
            return await _dbContext.Integrationservicesettings.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }

    }
}
