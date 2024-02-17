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
    public class WorkflowTasksRepository : Repository<Workflowtask>, IWorkflowTasksRepository
    {
        public WorkflowTasksRepository(_bmtContext dbContext) : base(dbContext)
        {

        }
       
        public async Task<IEnumerable<Workflowtask>> GetWorkflowTasksListByStatusAsync(int taskid, int status)
        {
            return await _dbContext.Workflowtasks.AsNoTracking()
               .Where(x => x.CurrentStatus== (status==0? x.CurrentStatus : status) && x.PredesessorTaskId == (taskid == 0 ? x.PredesessorTaskId : taskid))
                .ToListAsync();
        }
       
        public async Task<IEnumerable<Workflowtask>> GetWorkflowTasksByNameAsync(string name)
        {        
            return await _dbContext.Workflowtasks.AsNoTracking()
               .Where(x => x.Name.ToLower().Contains(name.ToLower()) || x.Name.ToLower().Contains(name.ToLower())).OrderBy(x => x.Name)
                .ToListAsync();
           
        }
        public async Task<IEnumerable<Workflowtask>> bulkaddorupdates(List<Workflowtask> ls)
        {
            var newLs = ls.Where(x => x.Id == 0).ToList();
            if (newLs != null && newLs.Any())
                await _dbContext.Workflowtasks.AddRangeAsync(newLs);
            var updateLs = ls.Where(x => x.Id > 0).ToList();
            if (updateLs != null && updateLs.Any())
                _dbContext.Workflowtasks.UpdateRange(updateLs);

            await _dbContext.SaveChangesAsync();
            return newLs;          
        }
        public async Task<IEnumerable<Workflowtask>> GetWorkflowTasksAllFiltersAsync(Workflowtask model)
        {
            return await _dbContext.Workflowtasks.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.Name.Contains((""+ model.Name)) && x.CurrentStatus == (model.CurrentStatus == 0 ? x.CurrentStatus : model.CurrentStatus)).OrderBy(x => x.Name)
                .ToListAsync();
        }
        public async Task<Workflowtask> GetWorkflowTaskssByIdAsync(Int32 id)
        {   
            return await _dbContext.Workflowtasks.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }

    }
}
