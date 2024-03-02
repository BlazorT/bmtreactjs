using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.EntityFrameworkCore;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using Blazor.Web.UI.Interfaces;


namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class OrganiaztionController : ControllerBase
    { //Almas 
        private IMemoryCache _cache;
        private readonly ILogger<OrganiaztionController> _logger;       
        private readonly IBlazorRepoPageService _blazorRepoPageService;
       // private readonly IDspTablesService _dspTablesService;
      
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        // string applicationPath = string.Empty;
        #region "Constructor and initialization"
        public OrganiaztionController(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IBlazorRepoPageService blazorRepoPageService, IHttpContextAccessor httpContextAccessor, ILogger<OrganiaztionController> logger,  IMemoryCache cache)
        {
            _logger = logger;         
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));          

            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));         
            _logger.LogInformation("Web Api Service Started  at - " + System.DateTime.Now.ToLongTimeString());
        }
        #endregion
        #region "Gets"   

        //[HttpPost("AddUpdateNetworkSettingsFormData")]
        [HttpGet("AddUpdateNetworkSettingsFormData")]
        [Route("AddUpdateNetworkSettingsFormData")]
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

        #endregion
        #region "submit actions"        
        //[HttpGet("submitinventory")]
    
        #endregion

    }

}


