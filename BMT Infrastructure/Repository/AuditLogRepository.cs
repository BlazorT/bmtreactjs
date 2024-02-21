using com.blazor.bmt.core;
using com.blazor.bmt.core.repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class AuditLogRepository : RepositoryTransaction<Auditlog>, IAuditLogRepository
    {
        public AuditLogRepository(_bmtContext dbContext) : base(dbContext)
        {

        }      
        public async Task<IEnumerable<Auditlog>> GetAuditLogListAsync()
        {
            return await _dbContext.Auditlogs.AsNoTracking()
                  .Where(x => x.CreatedAt >= System.DateTime.Now.AddDays(-30) )
                   .ToListAsync();
           
        }

        public async Task<Auditlog> GetAuditLogByIDAsync(long Id)
        {
            return await _dbContext.Auditlogs.AsNoTracking()
                  .Where(x => x.Id== Id && x.CreatedAt >= System.DateTime.Now.AddDays(-30))
                   .FirstOrDefaultAsync();

        }
        
        public async Task<IEnumerable<Auditlog>> GetAuditLogDetailsAsync(Auditlog log) {
            return await _dbContext.Auditlogs.AsNoTracking()
                       .Where(x => x.Id == (log.Id == 0? x.Id : log.Id) && x.OrgId == (log.OrgId == 0 ? x.OrgId : log.OrgId) &&( ("" + x.OldValue).ToLower().Contains(("" + log.KeyValue).ToLower())  || ("" + x.AttributeName).ToLower().Contains(("" + log.KeyValue).ToLower()) ||  (""+x.KeyValue).ToLower().Contains(("" + log.KeyValue).ToLower())) && x.CreatedAt >= (log.CreatedAt == null?System.DateTime.Now.AddDays(-1): log.CreatedAt)).OrderByDescending(k => k.Id)
                      .ToListAsync();
        }
        public async Task<IEnumerable<Auditlog>> GetAuditLogByKeywordAsync(string keyword)
        {           
            return await _dbContext.Auditlogs.AsNoTracking()
               .Where(x => (x.KeyValue.ToLower().Contains(keyword) || x.OldValue.ToLower().Contains(keyword) || x.NewValue.ToLower().Contains(keyword)) && x.CreatedAt >= System.DateTime.Now.AddDays(-30)).OrderByDescending(k=>k.Id)
                .ToListAsync();
           
        }
  
        public async Task<IEnumerable<Auditlog>> GetAuditLogByUserAsync(int userId)
        {
            return await _dbContext.Auditlogs.AsNoTracking()
                .Where(x => x.CreatedBy== userId && x.CreatedAt >= System.DateTime.Now.AddDays(-30)).OrderByDescending(k => k.Id)
                .ToListAsync();
        }
    }
}
