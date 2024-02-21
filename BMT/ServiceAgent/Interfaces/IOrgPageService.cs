using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.interfaces
{
        public interface IOrgPageService
    {
        Task<IEnumerable<OrganizationViewModel>> GetOrgsList();
        Task<IEnumerable<OrganizationViewModel>> GetOrgsByName(string name);
        Task<IEnumerable<OrganizationViewModel>> GetOrgsAllAsync(OrganizationViewModel model);
        //Task<IEnumerable<OrganizationViewModel>> OrgPartnerList(int OrgId, int statusid);        
        Task<OrganizationViewModel> GetOrgById(int id);
        Task<OrganizationViewModel> Create(OrganizationViewModel vModel);
        // Task<IEnumerable<OrganizationViewModel>> OrgPartnerBulkAddorUpdates(List<OrganizationViewModel> ls);
        Task Update(OrganizationViewModel model);
        Task Delete(OrganizationViewModel vmodel);
    }
    }

