using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositories
{
    public interface IAuditLogRepository : IRepositoryTransaction<Auditlog>
    {
        Task<IEnumerable<Auditlog>> GetAuditLogListAsync();       
        Task<IEnumerable<Auditlog>> GetAuditLogDetailsAsync(Auditlog log);
        Task<Auditlog> GetAuditLogByIDAsync(long Id);
        Task<IEnumerable<Auditlog>> GetAuditLogByUserAsync(int userId);
        Task<IEnumerable<Auditlog>> GetAuditLogByKeywordAsync(string keyword);
    }
}
