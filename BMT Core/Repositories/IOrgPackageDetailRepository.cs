using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IOrgPackageDetailRepository : IRepositoryTransaction<Orgpackagedetail>
    {
        Task<IEnumerable<Orgpackagedetail>> GetOrgPackageDetailsBynetworkAndOrgAsync(int networkid, int orgid);
        Task<IEnumerable<Orgpackagedetail>> GetOrgPackageDetailByNameAsync(string name);
        Task<IEnumerable<Orgpackagedetail>> GetOrgPackageDetailsAllFiltersAsync(Orgpackagedetail model);
        Task<Orgpackagedetail> GetOrgPackageDetailseAsync(Int64 id);


    }
}
