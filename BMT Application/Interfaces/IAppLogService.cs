using Blazor.Web.Application.Models;
using com.blazor.bmt.application.model;
using com.blazor.bmt.viewmodels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IAppLogService
    {
        Task<IEnumerable<ApplogModel>> GetApplogList();
        Task<ApplogModel> GetApplogById(long logId);
        Task<IEnumerable<ApplogModel>> GetAppLogDetails(ApplogModel AppLogModel);
        Task<IEnumerable<ApplogModel>> GetAppLogAllFiltersDetails(AppLogViewModel AppLogModel);
        Task<IEnumerable<ApplogModel>> GetAppLogByUserId(int userId);
        Task<IEnumerable<ApplogModel>> GetLogBySearchKeyword(string keyword);
        Task Create(ApplogModel appLogModel);
        Task Update(ApplogModel appLogModel);       
    }
}
