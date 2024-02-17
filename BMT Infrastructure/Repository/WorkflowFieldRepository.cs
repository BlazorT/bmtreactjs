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
    public class WorkflowFieldRepository : RepositoryTransaction<Wffield>, IWorkflowFieldRepository
    {
        public WorkflowFieldRepository(_bmtContext dbContext) : base(dbContext)
        {

        }       
        public async Task<IEnumerable<Wffield>> GetWorkflowEntityFieldsListByEntityAsync(int entityId)
        {
            return await _dbContext.Wffields.AsNoTracking()
               .Where(x => x.EntityId == (entityId == 0 ? x.EntityId : entityId))
                .ToListAsync();
        }         
     
        public async Task<IEnumerable<Wffield>> bulkaddorupdates(List<Wffield> ls)
        {
            var newLs = ls.Where(x => x.Id == 0).ToList();
            if (newLs != null && newLs.Any())
                await _dbContext.Wffields.AddRangeAsync(newLs);
            var updateLs = ls.Where(x => x.Id > 0).ToList();
            if (updateLs != null && updateLs.Any())
                _dbContext.Wffields.UpdateRange(updateLs);

            await _dbContext.SaveChangesAsync();
            return newLs;          
        }
        public async Task<IEnumerable<Wffield>> GetWorkflowEntityFieldsAllFiltersAsync(Wffield model)
        {
            return await _dbContext.Wffields.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.Name.Contains((""+ model.Name)) && x.FieldTypeId == (model.FieldTypeId == 0 ? x.FieldTypeId : model.FieldTypeId)).OrderBy(x => x.Name)
                .ToListAsync();
        }
        public async Task<Wffield> GetWorkflowEntityFieldsByIdAsync(Int64 id)
        {   
            return await _dbContext.Wffields.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }

    }
}
