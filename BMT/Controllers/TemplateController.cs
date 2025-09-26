using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.application.interfaces;

using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Blazor.Web.UI.Interfaces;

using Blazor.Web.Application.Interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.infrastructure.repositories;

namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class TemplateController : ControllerBase
    { //Almas 
        private IMemoryCache _cache;
        private readonly ILogger<TemplateController> _logger;
        private readonly IAppLogPageService _appLogPageService;        
        private readonly ICampaignTemplateService _campaignTemplateService;
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        // string applicationPath = string.Empty;
        #region "Constructor and initialization"
        public TemplateController(Microsoft.Extensions.Hosting.IHostingEnvironment hostingEnvironment, ICampaignTemplateService campaignTemplateService, IAppLogPageService appLogPageService, IHttpContextAccessor httpContextAccessor, ILogger<TemplateController> logger,  IMemoryCache cache)
        {
            _logger = logger;           
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _campaignTemplateService = campaignTemplateService ?? throw new ArgumentNullException(nameof(campaignTemplateService));                    
            _appLogPageService = appLogPageService ?? throw new ArgumentNullException(nameof(appLogPageService)); 
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            // applicationPath = _hostingEnvironment.ContentRootPath;
            _logger.LogInformation("TemplateController Service Started  at - " + System.DateTime.Now.ToLongTimeString());
        }
        #endregion       
 
        [HttpGet("campaigntemplates")]
        [HttpPost("campaigntemplates")]
        [Route("campaigntemplates")]
        public async Task<ActionResult> GetCampaignTemplates([FromBody] WebApiFilters filter)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
                blazorApiResponse.status = true;
                blazorApiResponse.data = await _campaignTemplateService.GetCampaignTemplatesByNetworkList(Convert.ToInt32(filter.id));
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
		[HttpGet("campaigntemplatesallnetworks")]
		[HttpPost("campaigntemplatesallnetworks")]
		[Route("campaigntemplatesallnetworks")]
		public async Task<ActionResult> GetCampaignAllnetworksTemplates([FromBody] CompaigntemplateModel filter)
		{
			if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
			BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
			try
			{
				//var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
				blazorApiResponse.status = true;
				blazorApiResponse.data = await _campaignTemplateService.GetCompaigntemplatesAllFiltersList(filter);
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
		[HttpPost("submitcampaigntemplate")]
		[Route("submitcampaigntemplate")]
		public async Task<ActionResult> SubmitCampaignTemplateData([FromBody] CompaigntemplateModel cm)
		{

			BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
			if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
			try
			{
                if (cm.id <= 0)
                {
                    blazorApiResponse.data = await _campaignTemplateService.Create(cm);
                    blazorApiResponse.status = true;
                    //GlobalUTIL.loadConfigurations(GlobalSettings.DefaultOrgId);
                    blazorApiResponse.message = string.Format(BlazorConstant.INSERTED_SUCCESS, cm.Name, GlobalUTIL.CurrentDateTime.ToLongDateString());
                }
                else {
				    await _campaignTemplateService.Update(cm);
                    blazorApiResponse.data = cm;
					blazorApiResponse.status = true;
					//GlobalUTIL.loadConfigurations(GlobalSettings.DefaultOrgId);
					blazorApiResponse.message = string.Format(BlazorConstant.UPDATED_SUCCESS, cm.Name, GlobalUTIL.CurrentDateTime.ToLongDateString());
				}
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
    }

}


