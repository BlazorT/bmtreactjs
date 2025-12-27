using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IOrglicensingRepository : IRepositoryTransaction<Orglicensing>
    {
        Task<IEnumerable<Orglicensing>> GetOrglicensingsBynetworkAndOrgAsync(int networkid, int orgid);
        Task<IEnumerable<Orglicensing>> GetOrglicensingByNameAsync(string keyword);
        Task<IEnumerable<Orglicensing>> GetOrglicensingsAllFiltersAsync(Orglicensing model);
        Task<Orglicensing> GetOrglicensingByIdAsync(Int64 id);
        //Task<Orglicensing> GetOrglicensingAsync(Int64 id)


    }
}
