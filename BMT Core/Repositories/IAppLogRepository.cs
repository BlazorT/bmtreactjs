using com.blazor.bmt.core.baseentity;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.viewmodels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositories
{
    public interface IAppLogRepository : IRepositoryTransaction<Applog>
    {
        Task<IEnumerable<Applog>> GetAppLogListAsync();       
        Task<IEnumerable<Applog>> GetAppLogDetailsAsync(Applog AppLog);
        Task<Applog> GetAppLogByIDAsync(long logId);
        Task<IEnumerable<Applog>> GetAppLogByUserAsync(int userId);
        Task<IEnumerable<Applog>> GetAppLogAllFiltersAsync(AppLogViewModel model);
        Task<IEnumerable<Applog>> GetAppLogByKeywordAsync(string keyword);
        Task<IEnumerable<Applog>> InsertUpdateBulk(List<Applog> nlst);
    }
}
