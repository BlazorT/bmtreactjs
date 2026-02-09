using Blazor.Web.UI.Interfaces;
using Blazor.Web.UI.Services;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Data;


namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class OrganizationController : ControllerBase
    { //Almas 
        private IMemoryCache _cache;
        private readonly ILogger<OrganizationController> _logger;       
        private readonly IBlazorRepoPageService _blazorRepoPageService;
        private readonly IUsersPageService _usersPageService;
        private readonly IOrganizationService _organizationService;
        private readonly IApprovalRequestService _approvalRequestService;
        // private readonly IDspTablesService _dspTablesService;
        private readonly IGlobalNetworkDetailService _GlobalNetworkDetailService;
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;      
        #region "Constructor and initialization"
        public OrganizationController(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IApprovalRequestService approvalRequestService, IOrganizationService organizationService, IGlobalNetworkDetailService globalNetworkDetailService, IBlazorRepoPageService blazorRepoPageService, IUsersPageService usersPageService, IHttpContextAccessor httpContextAccessor, ILogger<OrganizationController> logger,  IMemoryCache cache)
        {
            _logger = logger;         
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _GlobalNetworkDetailService = globalNetworkDetailService ?? throw new ArgumentNullException(nameof(globalNetworkDetailService));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _organizationService = organizationService ?? throw new ArgumentNullException(nameof(organizationService));
            _approvalRequestService = approvalRequestService ?? throw new ArgumentNullException(nameof(approvalRequestService));
            _usersPageService = usersPageService ?? throw new ArgumentNullException(nameof(usersPageService));  
            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));         
            _logger.LogInformation("Web Api Service Started  at - " + System.DateTime.Now.ToLongTimeString());
        }
        #endregion
        #region "Gets"   

        //[HttpPost("AddUpdateNetworkSettingsFormData")]
        // [HttpGet("addupdatenetworksettings")]
        [HttpPost("addupdatenetworksettings")]
        [Route("addupdatenetworksettings")]
        public async Task<BlazorResponseViewModel> AddUpdateNetworkSettingsFormData([FromBody] List<OrgpackagedetailViewModel> pcdl)
        {
            BlazorResponseViewModel response = new BlazorResponseViewModel();
            try
            {
                int UserId = 0;
                if (pcdl != null)
                {
                    response = await _blazorRepoPageService.AddUpdateNetworkSettingsFormData(pcdl, UserId);
                    response.status = true;
                }
                else
                {
                    response.status = false;
                    response.message = string.Format(BlazorConstant.INSERTED_FAILED, "Network setting failed", GlobalUTIL.CurrentDateTime.ToString());
                }
                // response.status = false;

            }
            catch (Exception ex)
            {
                response.status = false;
                response.message = ex.Message;
            }
            return response;

        }

        [HttpPost("orgpackagedetails")]
        [Route("orgpackagedetails")]
        public async Task<BlazorResponseViewModel> GetOrgPackageDetails([FromBody] WebApiFilters filter)
        {
            BlazorResponseViewModel response = new BlazorResponseViewModel();
            try
            {
              
                if (filter != null)
                {
                    response.data = await _organizationService.GetOrgPackageDetailsBynetworkAndOrgAsync( Convert.ToInt32(filter.id), Convert.ToInt32(filter.orgId));
                    response.status = true;
                }
                else
                {
                    response.status = false;
                    response.message = string.Format(BlazorConstant.INSERTED_FAILED, "Org Package retieval failed", GlobalUTIL.CurrentDateTime.ToString());
                }
                // response.status = false;

            }
            catch (Exception ex)
            {
                response.status = false;
                response.message = ex.Message;
            }
            return response;

        }
        [HttpGet("adminlist")]
        [HttpPost("adminlist")]
        [Route("adminlist")]
        public async Task<BlazorResponseViewModel> AdminList()
        {
            BlazorResponseViewModel BlazorResponseViewModel = new BlazorResponseViewModel();
            try
            {
                BlazorResponseViewModel.data = await _usersPageService.GetUsersKeyValueCollection(util.USERROLES.ADMIN);
                BlazorResponseViewModel.status = true;
            }
            catch (Exception ex)
            {
                BlazorResponseViewModel.message = ex.Message;
                BlazorResponseViewModel.status = false;
            }
            return BlazorResponseViewModel;
        }

        [HttpGet("approvalrequests")]
        [HttpPost("approvalrequests")]
        [Route("approvalrequests")]
        public async Task<BlazorResponseViewModel> GetApprovalLists(ApprovalrequestModel model)
        {
            BlazorResponseViewModel BlazorResponseViewModel = new BlazorResponseViewModel();
            try
            {
                BlazorResponseViewModel.data = await _approvalRequestService.GetApprovalRequestAllFiltersAsync(model);
                BlazorResponseViewModel.status = true;
            }
            catch (Exception ex)
            {
                BlazorResponseViewModel.message = ex.Message;
                BlazorResponseViewModel.status = false;
            }
            return BlazorResponseViewModel;
        }
        [HttpPost]
        [Route("addupdateapprequest")]
        public async Task<ActionResult> AddUpdateApproval([FromBody] ApprovalrequestModel arm)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                if (arm != null && arm.Id <= 0)
                {
                    arm.CreatedAt = GlobalUTIL.CurrentDateTime;
                    arm.CreatedBy = (arm.LastUpdatedBy == null || arm.LastUpdatedBy == 0) ? GlobalBasicConfigurationsViewModel.DefaultPublicUserId : arm.LastUpdatedBy;
                    arm.LastUpdatedBy = (arm.LastUpdatedBy == null || arm.LastUpdatedBy == 0) ? GlobalBasicConfigurationsViewModel.DefaultPublicUserId : arm.LastUpdatedBy;
                    arm.RowVer = 1;
                    arm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    //dvm.LastUpdatedBy = dvm.LastUpdatedBy;
                    arm= await _approvalRequestService.Create(arm);
                        //if (urg != null && urg.Status == 1)
                        //{
                        //    await _utilPageService.sendOrgRegistrationEmailNotfification(urg.Id, "" + urg.Email, "" + urg.Name);
                        //}
                    blazorApiResponse.data = arm;

                }
                else
                {
                    arm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    arm.LastUpdatedBy = arm.CreatedBy = (arm.LastUpdatedBy == null || arm.LastUpdatedBy == 0) ? GlobalBasicConfigurationsViewModel.DefaultPublicUserId : arm.LastUpdatedBy;
                  ApprovalrequestModel dbapprov=  await _approvalRequestService.Update(arm);
                    blazorApiResponse.data = dbapprov;
                }
                blazorApiResponse.message = string.Format("Approval Request {0} has been saved", "" + arm.Reqcode);
                blazorApiResponse.status = true;

            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return Ok(blazorApiResponse);
            // .ToArray();
        }

        [HttpGet("globalnetworks")]
        [HttpPost("globalnetworks")]
        [Route("globalnetworks")]
        public async Task<BlazorResponseViewModel> GetGlobalNetworkDetails()
        {
            BlazorResponseViewModel BlazorResponseViewModel = new BlazorResponseViewModel();
            try
            {
                BlazorResponseViewModel.data = await _GlobalNetworkDetailService.GetGlobalNetworkDetailByStatusList((int)util.COMPAIGNS_STATUS.NEW);
                BlazorResponseViewModel.status = true;
            }
            catch (Exception ex)
            {
                BlazorResponseViewModel.message = ex.Message;
                BlazorResponseViewModel.status = false;
            }
            return BlazorResponseViewModel;
        }
        #endregion
        #region "submit actions"        
        //[HttpGet("submitinventory")]

        #endregion

    }

}


