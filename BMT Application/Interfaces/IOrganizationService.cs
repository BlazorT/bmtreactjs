using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IOrganizationService
    {
        Task<IEnumerable<OrganizationModel>> GetOrgsByStatusList(int status);

        Task<IEnumerable<OrganizationModel>> GetOrgsList(string keyword);
        Task<IEnumerable<OrganizationModel>> GetOrgsAllListAsync(OrganizationModel model);
        Task<OrganizationModel> GetOrgByIdList(Int32 id);
        Task<OrganizationModel> Create(OrganizationModel model);
        Task Update(OrganizationModel model);
        Task Delete(OrganizationModel model);  

    }
}
