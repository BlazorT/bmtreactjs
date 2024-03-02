using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositories
{
    public interface IGlobalNetworkDetailsRepository : IRepositoryTransaction<Globalnetworkdetail>
    {
        Task<IEnumerable<Globalnetworkdetail>> GetGlobalNetworkDetailListByStatusAsync(int status);
        Task<Globalnetworkdetail> GetGlobalNetworkDetailByIdAsync(Int64 id);
        //Task<IEnumerable<BundlingPackageDetail>> GetBundlingPackageByNameAsync(string name);
        Task<IEnumerable<Globalnetworkdetail>> GetGlobalNetworkDetailByNetworkIdAsync(int networkId);

    }
}
