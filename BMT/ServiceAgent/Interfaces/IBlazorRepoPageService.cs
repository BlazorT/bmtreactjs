using Blazor.Web.ViewModels;
using com.blazor.bmt.application.model;
using com.blazor.bmt.viewmodels;
namespace Blazor.Web.UI.Interfaces
{
    public interface IBlazorRepoPageService
    {
        Task<IEnumerable<ReportViewModel>> GetOrgRegistrationReportData(ReportViewModel resportViewmodel);
        Task<IEnumerable<ReportCompaignsViewModel>> GetOrgCompaignsReportData(ReportCompaignsViewModel resportViewmodel);
        Task<IEnumerable<ReportStatsViewModel>> GetStatsReportData(ReportStatsViewModel resportViewmodel);
        Task<LoginViewModel> GetUserVerificationData(UserViewModel model);
        Task<IEnumerable<DashboardViewModel>> GetDashboardData(DashboardViewModel viewModel);
        Task<IEnumerable<AuditLogViewModel>> GetAuditLogDetailsData(AuditLogViewModel viewModel);
        Task<IEnumerable<OrganizationViewModel>> GetOrganizationListReport(int OrgId, string keyword, int status, DateTime dtFrom, DateTime dtTo);
        Task<IEnumerable<OrgpackagedetailViewModel>> GetOrganizationBundlingData(OrganizationViewModel model);
        Task<IEnumerable<UserViewModel>> GetBMTUsersListAsync(int userId, int OrgId, int roleId, string name, int status, DateTime dtFrom, DateTime dtTo);
       // Task<IEnumerable<Configration>> LoadBasicConfigurationsData();
        Task<IEnumerable<Configration>> LoadOrgConfigurationsData(int OrgId);
        Task<BlazorResponseViewModel> SocialMediaCreateLogin(UserViewModel model);
        Task<IEnumerable<BundlingpackagedetailViewModel>> LoadCustomBundlingPackagesData(int networks);
        Task<BlazorApiResponse> UpdateNetworksData(List<networkidvalues> lst, int UserId);
        Task<BlazorResponseViewModel> AddUpdateNetworkSettingsFormData(List<OrgpackagedetailViewModel> lst, int UserId);
        Task<BlazorResponseViewModel> UpdateCompaignStatus(CompaignsViewModel model);
        Task<IEnumerable<MenuViewModel>> loadRoleMenus(int roleid);
        Task<BlazorResponseViewModel> AddUpdateRoleRights(List<RolerightViewModel> vLst);
         Task<BlazorResponseViewModel> postCompaignData(CompaignsViewModel model, int UserId);
        Task<IEnumerable<OrganizationViewModel>> GetOrganizationsData(OrganizationViewModel model);
        Task<IEnumerable<CampaignRecipientsViewModel>> GetCampaignRecipientsData(CampaignRecipientsViewModel cModel);
        Task<IEnumerable<CompaignsViewModel>> GetCompaignsData(CompaignsViewModel model);
        Task<IEnumerable<NetworkViewModel>> GetNetworkData(int status = 1);
        Task<IEnumerable<CampaignNotificationViewModel>> GetCampaignNotificationData(CampaignNotificationViewModel cModel);
        // Task<BlazorResponseViewModel> postCompaignContactData(List<CompaignrecipientModel> lst);
        Task<IEnumerable<BundlingpackagedetailViewModel>> LoadOrgBundlingPackagesData(int orgid = 0, int networkId = 0);
        Task<BlazorResponseViewModel> postCompaignContactData(List<CompaignrecipientModel> lst);
    }
}

