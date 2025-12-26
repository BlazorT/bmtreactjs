using com.blazor.bmt.core;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.util;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class TemplateVariableRepository : RepositoryTransaction<Templatevariable>, ITemplatevariablerRepository
    {
        public TemplateVariableRepository(_bmtContext dbContext) : base(dbContext)
        {

        }
       // Task<IEnumerable<Templatevariable>> GetTemplateVariablesByContactIdAsync(string name);
       // Task<IEnumerable<Templatevariable>> GetTemplateVariablesByNetworkIdAsync(int orgId, int networkId);
        //Task<Templatevariable> GetTemplateVariableByIdAsync(long id);
       // Task<IEnumerable<Templatevariable>> GetTemplateVariablesByAllFiltersAsync(Templatevariable template);
        public async Task<Templatevariable> GetTemplateVariableByIdAsync(Int64 id)
        {
            return await _dbContext.Templatevariables.AsNoTracking()
                     .Where(x => (x.Id== id ))
                     .FirstOrDefaultAsync();
        }
       
        public async Task<IEnumerable<Templatevariable>> GetTemplateVariablesByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Templatevariables
               .Where(x => x.Name.ToLower().Contains(name.ToLower()))
                .ToListAsync();
        }
        public async Task<IEnumerable<Templatevariable>> GetTemplateVariablesByNetworkIdAsync(int orgId,int networkid)
        {
            return await _dbContext.Templatevariables
               .Where(x => x.Networkid == networkid && x.Orgid == orgId)
                .ToListAsync();
        }
       
        public async Task<IEnumerable<Templatevariable>> GetTemplateVariablesByAllFiltersAsync(Templatevariable model)
        {

            return await _dbContext.Templatevariables.AsNoTracking()
               .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && (x.Orgid == (Convert.ToInt32(model.Orgid) == 0 ? x.Orgid : model.Orgid)) && (x.Status == (model.Status == 0 ? x.Status : model.Status) && x.Networkid == (Convert.ToInt32(model.Networkid) == 0 ? x.Networkid : model.Networkid)) && x.Name.Contains("" + model.Name) && x.CreatedAt >= (model.CreatedAt.Year<= 1900? x.CreatedAt:model.CreatedAt))
                .ToListAsync();

        }


    }
}
