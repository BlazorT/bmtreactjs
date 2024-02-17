using Blazor.Web.Application.Models;
using com.blazor.bmt.application.model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.Application.Interfaces
{
    public interface IAppLogService
    {
        Task<IEnumerable<ApplogModel>> GetApplogList();
        Task<ApplogModel> GetApplogById(long logId);
        Task<IEnumerable<ApplogModel>> GetAppLogDetails(ApplogModel AppLogModel);
        
        Task<IEnumerable<ApplogModel>> GetAppLogByUserId(int userId);
        Task<IEnumerable<ApplogModel>> GetLogBySearchKeyword(string keyword);
        Task Create(ApplogModel appLogModel);
        Task Update(ApplogModel appLogModel);       
    }
}
