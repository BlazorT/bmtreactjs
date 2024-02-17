using com.blazor.bmt.core.baseentity;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositories
{
    public interface IAuditLogRepository : IRepositoryTransaction<AuditLog>
    {
        Task<IEnumerable<AuditLog>> GetAuditLogListAsync();       
        Task<IEnumerable<AuditLog>> GetAuditLogDetailsAsync(AuditLog log);
        Task<AuditLog> GetAuditLogByIDAsync(long Id);
        Task<IEnumerable<AuditLog>> GetAuditLogByUserAsync(int userId);
        Task<IEnumerable<AuditLog>> GetAuditLogByKeywordAsync(string keyword);
    }
}
