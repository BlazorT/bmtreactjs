using Blazor.Web.ViewModels;
using com.blazor.bmt.viewmodels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IGlobalNetworkDetailService
    {
        Task<IEnumerable<GlobalnetworkdetailViewModel>> GetGlobalNetworkDetailByStatusList(int status);
        Task<GlobalnetworkdetailViewModel> GetGlobalNetworkDetailByIdAsync(Int64 Id);
        Task<IEnumerable<GlobalnetworkdetailViewModel>> GetGlobalNetworkDetailByNetWorkIdAsync(int netWorkId);
        //Task<IEnumerable<BundlingPackageDetail>> GetBundlingPackagesList(string details);
        Task<GlobalnetworkdetailViewModel> Update(GlobalnetworkdetailViewModel model);

    }
}
