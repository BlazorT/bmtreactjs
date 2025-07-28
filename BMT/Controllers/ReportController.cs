using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using Blazor.Web.UI.Interfaces;

namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class ReportController : ControllerBase
    { //Almas 
        private IMemoryCache _cache;
        private readonly ILogger<ReportController> _logger;       
        private readonly IBlazorRepoPageService _blazorRepoPageService;       
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        // string applicationPath = string.Empty;
        #region "Constructor and initialization"
        public ReportController(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment,  IBlazorRepoPageService blazorRepoPageService, IHttpContextAccessor httpContextAccessor, ILogger<ReportController> logger,  IMemoryCache cache)
        {
            _logger = logger;         
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));

            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            // applicationPath = _hostingEnvironment.ContentRootPath;
            _logger.LogInformation("Web Api Service Started  at - " + System.DateTime.Now.ToLongTimeString());
        }
        #endregion  
        [HttpPost("organizationsreportdata")]
        [HttpGet("organizationsreportdata")]
        [Route("organizationsreportdata")]
        public async Task<ActionResult> GetOrganizationsReportData([FromBody] OrganizationViewModel vm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
                      
            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                        response.data= await _blazorRepoPageService.GetOrganizationListReport(vm.Id,  ""+ vm.Name, vm.Status, vm.CreatedAt, vm.LastUpdatedAt==null? Convert.ToDateTime(vm.LastUpdatedAt):GlobalUTIL.CurrentDateTime);                   
                        response.status = true;
            }
            catch (Exception ex)
            {
                response.status = false;
                response.errorCode = "408";
                response.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return Ok(response);

        }
        [HttpGet("CampaignNotificationReportData")]
        [HttpPost("CampaignNotificationReportData")]
        [Route("CampaignNotificationReportData")]
        public async Task<ActionResult> GetCampaignNotificationReportData([FromBody] CampaignNotificationViewModel vm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) ||
                Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)
            {
                return Ok(new BlazorApiResponse{status = false,errorCode = "201",message = "Authorization Failed"});
            }
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                response.data = await _blazorRepoPageService.GetCampaignNotificationData(vm);
                response.status = true;
            }
            catch (Exception ex)
            {
                response.status = false;
                response.errorCode = "408";
                response.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }

            return Ok(response);
        }

    }

}


