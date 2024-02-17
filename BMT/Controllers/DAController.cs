using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.ui.services;

namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class DAController : ControllerBase
    { //Almas 
        private IMemoryCache _cache;
        private readonly ILogger<CommonController> _logger;
        // private readonly IAppLogPageService _appLogPageService;
        private readonly IBlazorUtilPageService _blazorUtilPageService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;
        //private readonly INotificationPageService _notificationPageService;  
        private readonly IUsersPageService _userPageService;    
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        // string applicationPath = string.Empty;
        #region "Constructor and initialization"
        public DAController(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IUsersPageService userPageService, IBlazorRepoPageService blazorRepoPageService, IBlazorUtilPageService blazorUtilPageService,  IHttpContextAccessor httpContextAccessor, ILogger<CommonController> logger,  IMemoryCache cache)
        {
            _logger = logger;  
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
             _userPageService = userPageService ?? throw new ArgumentNullException(nameof(userPageService));
            _blazorUtilPageService = blazorUtilPageService ?? throw new ArgumentNullException(nameof(blazorUtilPageService));
            //_appLogPageService = appLogPageService ?? throw new ArgumentNullException(nameof(appLogPageService));           
            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            // applicationPath = _hostingEnvironment.ContentRootPath;
            _logger.LogInformation("DAController Service Started  at - " + GlobalUTIL.CurrentDateTime.ToLongTimeString());
        }
        #endregion
        #region "DSPS Users"
       
       
        [HttpPost("dalist")]
        [HttpGet("dalist")]
        [Route("dalist")]
        public async Task<ActionResult> GetDAListData([FromBody] WebApiFilters model)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
            _logger.LogInformation("Global DA Data Request recieved -" + this.User.Identity.Name + Request.Path);
            //GlobalLOVsViewModel lookUps = new GlobalLOVsViewModel();
            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                var previousRequest = _cache.Get(model.dspid + this.User.Identity.Name + Request.Path + model.roleId);
                if (previousRequest == null)
                {
                    try
                    {
                        response.data = await _userPageService.GetUsersByDspAndRole(Convert.ToInt32(model.dspid), Convert.ToInt32(model.roleId));
                        response.status = true;
                    }
                    catch (Exception ex)
                    {
                        response.message = ex.Message;
                        response.status = false;
                    }
                    _cache.Set(model.dspid + this.User.Identity.Name + Request.Path + model.roleId, response.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SHORT_INTERVAL));
                }
                else
                {
                    response.status = true;
                    //blazorApiResponse.effectedRows = previousRequest..cu(previousRequest as List<UsersViewModel>).Count;
                    response.errorCode = "407";
                    response.data = previousRequest;
                    response.message = "Too many requests, must be 40 Seconds interval between next request!";
                }
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
        #endregion
        #region "submit actions"
        //[HttpGet("submitda")]
        [HttpPost("submitda")]
        [Route("submitda")]
        public async Task<ActionResult> submitDAData([FromBody] UserViewModel uvm)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                var previousRequest = _cache.Get("" + this.User.Identity.Name + Request.Path);
                if (previousRequest == null)
                {
                    if (uvm != null && uvm.Id <= 0)
                    {
                        uvm.Status = uvm.Status;
                        uvm.RowVer = 1;
                        uvm.CreatedBy = uvm.CreatedBy;
                        uvm.CreatedAt = GlobalUTIL.CurrentDateTime;
                        uvm.LastUpdatedBy = uvm.LastUpdatedBy;
                        uvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                        uvm.Password = GlobalUTIL.Encrypt(string.IsNullOrWhiteSpace(uvm.Password) ? uvm.Password : System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(("" + uvm.Password).Trim())), true, BlazorConstant.SECKEY);
                        blazorApiResponse.data = await _userPageService.Create(uvm);
                        if (!string.IsNullOrWhiteSpace(uvm.Email) && !string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
                            await _blazorUtilPageService.SendRegistrationEmailNotificationAsync((uvm.Dspid== null? GlobalSettings.DefaultDspId: Convert.ToInt32(uvm.Dspid)), uvm.Email, "DA Job Apply");
                        blazorApiResponse.message = string.Format(BlazorConstant.INSERTED_SUCCESS, uvm.LastName, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));
                    }
                    else
                    {
                        uvm.Status = uvm.Status;
                        uvm.RowVer = uvm.RowVer +1;                       
                        uvm.LastUpdatedBy = uvm.LastUpdatedBy;
                        uvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                        await _userPageService.Update(uvm);
                        blazorApiResponse.data = uvm;
                        blazorApiResponse.message = string.Format(BlazorConstant.UPDATED_SUCCESS, uvm.LastName, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));
                    }
                   
                    blazorApiResponse.status = true;          
                    _cache.Set("" + this.User.Identity.Name + Request.Path, blazorApiResponse.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));
                }
                else
                {
                    blazorApiResponse.status = true;
                    //blazorApiResponse.effectedRows = previousRequest..cu(previousRequest as List<UsersViewModel>).Count;
                    blazorApiResponse.errorCode = "407";
                    blazorApiResponse.data = previousRequest;
                    blazorApiResponse.message = "Too many requests, must be 40 Seconds interval between next request!";
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
        #endregion
      
    }

}


