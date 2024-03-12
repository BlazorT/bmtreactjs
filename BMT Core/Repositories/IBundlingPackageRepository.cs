using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.Core.Repositories
{
    public interface IBundlingPackageRepository : IRepositoryTransaction<Bundlingpackagedetail>
    {
        Task<IEnumerable<Bundlingpackagedetail>> GetBundlingPackagesListByStatusAsync(int status);
        Task<Bundlingpackagedetail> GetBundlingPackageByIdAsync(Int64 id);
        
        //Task<IEnumerable<BundlingPackageDetail>> GetBundlingPackageByNameAsync(string name);
        Task<IEnumerable<Bundlingpackagedetail>> GetBundlingPackageByNetworkIdAsync(int networkId);

    }
}
