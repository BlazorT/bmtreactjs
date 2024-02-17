using Blazor.Web.Application.Models;
using com.blazor.bmt.application.model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.Application.Interfaces
{
    public interface IAuditLogService
    {
        Task<IEnumerable<AuditLogModel>> GetAuditlogList();
        Task<AuditLogModel> GetAuditlogById(long logId);
        Task<IEnumerable<AuditLogModel>> GetAuditlogDetails(AuditLogModel model);
        
        Task<IEnumerable<AuditLogModel>> GetAuditlogByUserId(int userId);
        Task<IEnumerable<AuditLogModel>> GetAuditlogBySearchKeyword(string keyword);
        Task Create(AuditLogModel model);
       // Task Update(AuditLogModel model);       
    }
}
