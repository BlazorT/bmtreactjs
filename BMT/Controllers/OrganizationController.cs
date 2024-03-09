using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.EntityFrameworkCore;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using Blazor.Web.UI.Interfaces;
using Blazor.Web.UI.Services;
using com.blazor.bmt.application.interfaces;


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
        // private readonly IDspTablesService _dspTablesService;
        private readonly IGlobalNetworkDetailService _GlobalNetworkDetailService;
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;      
        #region "Constructor and initialization"
        public OrganizationController(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IGlobalNetworkDetailService globalNetworkDetailService, IBlazorRepoPageService blazorRepoPageService, IUsersPageService usersPageService, IHttpContextAccessor httpContextAccessor, ILogger<OrganizationController> logger,  IMemoryCache cache)
        {
            _logger = logger;         
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _GlobalNetworkDetailService = globalNetworkDetailService ?? throw new ArgumentNullException(nameof(globalNetworkDetailService));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _usersPageService= usersPageService ?? throw new ArgumentNullException(nameof(usersPageService));  
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


