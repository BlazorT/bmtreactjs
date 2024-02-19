using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IOrganizationRepository: IRepository<Organization>
    {
        Task<IEnumerable<Organization>> GetOrgListByStatusAsync(int status);
        Task<IEnumerable<Organization>> GetOrgByNameAsync(string name);
        Task<IEnumerable<Organization>> GetOrgAllFiltersAsync(Organization model);
        Task<Organization> GetOrgByIDeAsync(Int32 id);


    }
}
