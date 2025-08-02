using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
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

        Task<IEnumerable<OrgpackagedetailModel>> GetOrgPackageDetailsBynetworkAndOrgAsync(int networkid, int orgid);
        Task<IEnumerable<OrgpackagedetailModel>> GetOrgPackageDetailByNameAsync(string name);
        Task<IEnumerable<OrgpackagedetailModel>> GetOrgPackageDetailsAllFiltersAsync(OrgpackagedetailModel model);
        Task<OrgpackagedetailModel> GetOrgPackageDetailseAsync(Int64 id);

    }
}
