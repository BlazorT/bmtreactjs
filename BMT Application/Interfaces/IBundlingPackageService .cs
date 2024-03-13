using com.blazor.bmt.application.model;
using com.blazor.bmt.viewmodels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IBundlingPackageService
    {
        Task<IEnumerable<BundlingpackagedetailViewModel>> GetBundlingPackagesByStatusList(int status);
        Task<BundlingpackagedetailModel> GetBundlingPackageByIdAsync(Int64 Id);
        Task<IEnumerable<BundlingpackagedetailViewModel>> GetBundlingPackageByNetWorkIdAsync(int netWorkId);
        //Task<IEnumerable<BundlingPackageDetail>> GetBundlingPackagesList(string details);
        Task<BundlingpackagedetailViewModel> Update(BundlingpackagedetailViewModel model);

    }
}
