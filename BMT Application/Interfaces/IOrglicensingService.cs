using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IOrglicensingService
    {       
        Task<IEnumerable<OrglicensingModel>> GetOrglicensingList(string keyword);
        Task<IEnumerable<OrglicensingModel>> GetOrglicensingsAllListAsync(OrglicensingModel model);
        Task<OrglicensingModel> GetOrglicensingById(Int64 id);
        Task<IEnumerable<OrglicensingModel>> GetOrglicensingByNetworkAndOrglist(Int32 orgId, Int32 networkId);
        Task<OrglicensingModel> Create(OrglicensingModel model);
        Task Update(OrglicensingModel model);
        Task Delete(OrglicensingModel model);

        

    }
}
