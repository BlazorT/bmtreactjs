using com.blazor.bmt.core;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.viewmodels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class AppLogRepository : RepositoryTransaction<Applog>, IAppLogRepository
    {
        public AppLogRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Applog>> GetAppLogListAsync()
        {
            return await _dbContext.Applogs.AsNoTracking()
                  .Where(x => x.LogTime >= System.DateTime.Now.AddDays(-30) )
                   .ToListAsync();
           
        }

        public async Task<Applog> GetAppLogByIDAsync(long logId)
        {
            return await _dbContext.Applogs.AsNoTracking()
                  .Where(x => x.Id== logId && x.LogTime >= System.DateTime.Now.AddDays(-30))
                   .FirstOrDefaultAsync();

        }
        
        public async Task<IEnumerable<Applog>> GetAppLogDetailsAsync(Applog AppLog) {
            return await _dbContext.Applogs.AsNoTracking()
                       .Where(x => x.Id == (AppLog.Id == 0? x.Id : AppLog.Id) || x.UserId == (AppLog.UserId == 0 ? x.UserId : AppLog.UserId) || AppLog.LogDesc.ToLower().Contains(AppLog.LogDesc.ToLower()) || AppLog.LogTime >= (AppLog.LogTime==null?System.DateTime.Now.AddDays(-1):AppLog.LogTime)).OrderByDescending(k => k.LogTime)
                      .ToListAsync();
        }
        public async Task<IEnumerable<Applog>> GetAppLogByKeywordAsync(string keyword)
        {           
            return await _dbContext.Applogs.AsNoTracking()
               .Where(x => (x.LogDesc.ToLower().Contains(keyword) || x.MachineIp.ToLower().Contains(keyword)) && x.LogTime >= System.DateTime.Now.AddDays(-30)).OrderByDescending(k=>k.Id)
                .ToListAsync();
           
        }
        public async Task<IEnumerable<Applog>> GetAppLogAllFiltersAsync(AppLogViewModel model)
        {
            return await _dbContext.Applogs.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.OrgId == (Convert.ToInt32(model.OrgId) == 0 ? x.OrgId : model.OrgId)  && x.LogDesc.Contains("" + x.LogDesc) && x.LogTime >= model.LogTimeFrom && x.LogTime <= model.LogTimeTo)
                .ToListAsync();
        }
        public async Task<IEnumerable<Applog>> GetAppLogByUserAsync(int userId)
        {
            return await _dbContext.Applogs.AsNoTracking()
                .Where(x => x.UserId== userId && x.LogTime >= System.DateTime.Now.AddDays(-30)).OrderByDescending(k => k.Id)
                .ToListAsync();
        }
    }
}
