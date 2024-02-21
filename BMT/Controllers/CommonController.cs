using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.EntityFrameworkCore;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Blazor.Web.UI.Interfaces;

namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class CommonController : ControllerBase
    { //Almas 
        private IMemoryCache _cache;
        private readonly ILogger<CommonController> _logger;
        private readonly IAppLogPageService _appLogPageService;
        private readonly IConfigurationsService _configurationsService;
        private readonly IStatesService _stateService;
       // private readonly IIntegrationPageService _integrationPageService;
       // private readonly IOnlineUsersService _onlineUsersService;
        private readonly INotificationPageService _notificationPageService;
       // private readonly IBlazorUtilPageService _blazorUtilPageService;
       // private readonly IShiftsService _shiftsService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;
       // private readonly IBasicConfigurationsService _basicconfigurationsService;

        private readonly IBlazorUtilPageService _blazorUtilPageService;

        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        // string applicationPath = string.Empty;
        #region "Constructor and initialization"
        public CommonController(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IBlazorUtilPageService blazorUtilPageService,IAppLogPageService appLogPageService, IBlazorRepoPageService blazorRepoPageService, IConfigurationsService configurationsService, IStatesService statesService, IHttpContextAccessor httpContextAccessor, ILogger<CommonController> logger,  IMemoryCache cache)
        {
            _logger = logger;
            // _Configuration = configuration;
            // this.dbContext = new _bmtContext();
            _stateService = statesService ?? throw new ArgumentNullException(nameof(statesService));
           // _shiftsService = shiftsService ?? throw new ArgumentNullException(nameof(shiftsService));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
           // _basicconfigurationsService = basicconfigurationsService ?? throw new ArgumentNullException(nameof(basicconfigurationsService));
            _configurationsService = configurationsService ?? throw new ArgumentNullException(nameof(configurationsService));
          //  _onlineUsersService = onlineUsersService ?? throw new ArgumentNullException(nameof(onlineUsersService));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _appLogPageService = appLogPageService ?? throw new ArgumentNullException(nameof(appLogPageService));
          //  _notificationPageService = notificationPageService ?? throw new ArgumentNullException(nameof(notificationPageService));
            //_integrationPageService = integrationPageService ?? throw new ArgumentNullException(nameof(integrationPageService));

            _blazorUtilPageService = blazorUtilPageService ?? throw new ArgumentNullException(nameof(blazorUtilPageService));

            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            // applicationPath = _hostingEnvironment.ContentRootPath;
            _logger.LogInformation("Web Api Service Started  at - " + System.DateTime.Now.ToLongTimeString());
        }
        #endregion
        #region "Configurations"

        //[Authorize]
        [HttpGet("configurations")]
        [HttpPost("configurations")]
        [Route("configurations")]
        public async Task<ActionResult> loadConfigurations([FromBody] WebApiFilters filter)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {               
                    //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
                    blazorApiResponse.status = true;
                if (GlobalSettings.Configurations.Any())
                {
                    blazorApiResponse.data = GlobalSettings.Configurations.FirstOrDefault();
                }
                else {
                    GlobalUTIL.loadConfigurations(Convert.ToInt32(filter.orgId));
                    blazorApiResponse.data = GlobalSettings.Configurations.FirstOrDefault();
                }
                   
                  //  _cache.Set("" + this.User.Identity.Name + Request.Path, blazorApiResponse.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));
           
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
        [HttpGet("basicconfigurations")]
        [HttpPost("basicconfigurations")]
        [Route("basicconfigurations")]
        //public async Task<ActionResult> loadBasicConfigurations()
        //{
        //    if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
        //    BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
        //    try
        //    {
        //         //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
        //            blazorApiResponse.status = true;
        //            blazorApiResponse.data = await _basicconfigurationsService.GetListByNameAsync("");
              
        //    }
        //    catch (Exception ex)
        //    {
        //        blazorApiResponse.status = false;
        //        blazorApiResponse.errorCode = "408";
        //        blazorApiResponse.message = ex.Message;
        //        _logger.LogError(ex.StackTrace);
        //    }
        //    return Ok(blazorApiResponse);
        //    // .ToArray();
        //}
       // [HttpGet("submitconfigurations")]
        [HttpPost("submitconfigurations")]
        [Route("submitconfigurations")]
        public async Task<ActionResult> submitConfigurations([FromBody] ConfigrationsMergedViewModel cvm)
        {

            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
               
                    //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
                    blazorApiResponse.status = true;
                    //ConfigurationModel mdl = new ConfigurationModel(); //{ id= cvm.id };
              //  await _blazorUtilPageService.UpdateConfigurationChangeSet(cvm.us,  cvm);
                GlobalUTIL.loadConfigurations(GlobalSettings.DefaultOrgId);

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
        [HttpGet("submitbasicconfigurations")]
        [HttpPost("submitbasicconfigurations")]
        [Route("submitbasicconfigurations")]
        //public async Task<ActionResult> submitBasicConfigurations([FromBody] BasicConfigurationModel model)
        //{
        //    if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
        //    BlazorApiResponse response = new BlazorApiResponse();
        //    try
        //    {
        //        //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);

        //        BasicConfigurationModel dbModel = await  _basicconfigurationsService.GetBasicConfigurstionByIdAsync(model.Id);
        //        dbModel.LastUpdatedBy = model.LastUpdatedBy;// = GlobalUTIL.CurrentDateTime,
        //        dbModel.LastUpdatedAt = model.LastUpdatedAt;
        //        dbModel.SmtpServer = model.SmtpServer;
        //        dbModel.SmtpUser = model.SmtpUser;
        //        dbModel.SmsPassword = model.SmsPassword;

        //        dbModel.SmtpUser = model.SmtpUser;
        //        dbModel.Sslenabled = model.Sslenabled;
        //        dbModel.SmsServiceUrl = model.SmsServiceUrl;

        //        dbModel.Smtpport = model.Smtpport;
        //        dbModel.SmsQouta = model.SmsQouta;
        //        dbModel.SmsServiceUser = model.SmsServiceUser;
        //        dbModel.SmtpSenderEmail = model.SmtpSenderEmail;
        //        dbModel.SmtpUserPwd = model.SmtpUserPwd;
               
        //        model.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
        //        // Update BasicconfigurationModel
        //        await _basicconfigurationsService.Update(dbModel);
        //        response.status = true;
        //        response.message= string.Format(BlazorConstant.UPDATED_SUCCESS, model.DefaultDspname, GlobalUTIL.CurrentDateTime);

        //    }
        //    catch (Exception ex)
        //    {
        //        response.status = false;
        //        response.errorCode = "408";
        //        response.message = ex.Message;
        //        _logger.LogError(ex.StackTrace);
        //    }
        //    return Ok(response);
        //    // .ToArray();
        //}
        [HttpPost("lovs")]
        [HttpGet("lovs")]
        [Route("lovs")]
        public async Task<ActionResult> GetLOVSData()
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
            _logger.LogInformation("Global LOVs Data Request recieved -" + this.User.Identity.Name + Request.Path);
            GlobalLOVsViewModel lookUps = new GlobalLOVsViewModel();
            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                var previousRequest = _cache.Get(this.User.Identity.Name + Request.Path + "lov");
                if (previousRequest == null)
                {
                    try
                    {
                        var lst = GlobalUTIL.LoadGlobalLookUpCollectionViewModel();
                        //lookUps.dastatuses = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.STATUS).ToList();
                        lookUps.states = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.STATES).ToList();
                        lookUps.countries = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.COUNTRIES).ToList();                      
                        lookUps.notificationtypes = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.NOTIFICATION_TYPE).ToList();
                       // var lst = UTIL.GlobalApp.LoadGlobalLookUpCollectionViewModel(0);
                        lookUps.networks = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.NETWORKS).ToList();
                        lookUps.states = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.STATES).ToList();
                        lookUps.statuses = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.STATUS).ToList();
                        lookUps.Intervals = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.INTERVAL_TYPES).ToList();
                        lookUps.alerts = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.ALERT_LEVELS).ToList();
                        lookUps.notifications = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.NOTIFICATION_TYPE).ToList();
                        // lookUps.no = lst.Where(x => x.LVType == (int)UTIL.LOOKUP_TYPES.PACKAGE).ToList();

                        lookUps.packages = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.PACKAGE).ToList();
                        lookUps.Currencies = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.CURRENCIES).ToList();
                        //lookUps.Countries = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.COUNTRIES).ToList();
                        lookUps.PostTypes = lst.Where(x => x.LVType == (int)LOOKUP_TYPES.POST_TYPES).ToList();
                        response.data = lookUps;
                        response.status = true;
                    }
                    catch (Exception ex)
                    {
                        response.message = ex.Message;
                        response.status = false;
                    }
                    _cache.Set(this.User.Identity.Name + Request.Path + "lov", lookUps.states.Any() ? response.data : null, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SHORT_INTERVAL));
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
        [HttpPost("integrationservices")]
        [HttpGet("integrationservices")]
        [Route("integrationservices")]
        //public async Task<ActionResult> GetIntegrationServicesData([FromBody] IntegrationservicesettingViewModel vm)
        //{
        //    if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
        //    BlazorApiResponse response = new BlazorApiResponse();
        //    try
        //    {
        //        response.status = true;
        //        response.data = await _integrationPageService.GetIntegrationServicesAllAsync(vm);
        //    }
        //    catch (Exception ex)
        //    {
        //        response.status = false;
        //        response.errorCode = "408";
        //        response.message = ex.Message;
        //        _logger.LogError(ex.StackTrace);
        //    }
        //    return Ok(response);

        //}
        [HttpPost("rolemenus")]
        [HttpGet("rolemenus")]
        [Route("rolemenus")]
        public async Task<ActionResult> GetRoleMenus([FromBody] WebApiFilters filter)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != GlobalBasicConfigurationsViewModel.ApiAuthKey)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });           
            //GlobalLOVsViewModel lookUps = new GlobalLOVsViewModel();
            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                    try
                    {
                        response.data= await _blazorRepoPageService.loadRoleMenus(Convert.ToInt32(filter.roleId));
                        response.status = true;
                    }
                    catch (Exception ex)
                    {
                        response.message = ex.Message;
                        response.status = false;
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
        #region "Common Endpoints"
        [HttpGet("states")]
        [HttpPost("states")]
        [Route("states")]
        public async Task<ActionResult> loadStates([FromBody] StatesViewModel svm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                var previousRequest = _cache.Get("" + this.User.Identity.Name + Request.Path);
                if (previousRequest == null)
                {
                    blazorApiResponse.data= await _stateService.GetStatesByStatusList(svm.Status);
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
        [HttpGet("shifts")]
        [HttpPost("shifts")]
        [Route("shifts")]
        //public async Task<ActionResult> loadShifts([FromBody] ShiftModel sm)
        //{
        //    if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
        //    BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
        //    try
        //    {
        //        var previousRequest = _cache.Get("" + this.User.Identity.Name + sm.Dspid + Request.Path);
        //        if (previousRequest == null)
        //        {
        //            blazorApiResponse.data = await _shiftsService.GetShiftsAllFiltersAsync(sm);
        //            blazorApiResponse.status = true;

        //            _cache.Set("" + this.User.Identity.Name + sm.Dspid + Request.Path, blazorApiResponse.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));
        //        }
        //        else
        //        {
        //            blazorApiResponse.status = true;
        //            //blazorApiResponse.effectedRows = previousRequest..cu(previousRequest as List<UsersViewModel>).Count;
        //            blazorApiResponse.errorCode = "407";
        //            blazorApiResponse.data = previousRequest;
        //            blazorApiResponse.message = "Too many requests, must be 40 Seconds interval between next request!";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        blazorApiResponse.status = false;
        //        blazorApiResponse.errorCode = "408";
        //        blazorApiResponse.message = ex.Message;
        //        _logger.LogError(ex.StackTrace);
        //    }
        //    return Ok(blazorApiResponse);
        //    // .ToArray();
        //}
        [HttpGet("onlineusers")]
        [HttpPost("onlineusers")]
        [Route("onlineusers")]
        //public async Task<ActionResult> loadOnlineUsers([FromBody] OnlineUserViewModel ouvm)
        //{
        //    if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
        //    BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
        //    try
        //    {
        //        var previousRequest = _cache.Get("" + this.User.Identity.Name + Request.Path);
        //        if (previousRequest == null)
        //        {
        //            blazorApiResponse.data = await _onlineUsersService.GetListByStatusAsync(ouvm.Status,GlobalUTIL.CurrentDateTime.AddMonths(-12), GlobalUTIL.CurrentDateTime);
        //            blazorApiResponse.status = true;

        //            _cache.Set("" + this.User.Identity.Name + Request.Path, blazorApiResponse.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));
        //        }
        //        else
        //        {
        //            blazorApiResponse.status = true;
        //            //blazorApiResponse.effectedRows = previousRequest..cu(previousRequest as List<UsersViewModel>).Count;
        //            blazorApiResponse.errorCode = "407";
        //            blazorApiResponse.data = previousRequest;
        //            blazorApiResponse.message = "Too many requests, must be 40 Seconds interval between next request!";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        blazorApiResponse.status = false;
        //        blazorApiResponse.errorCode = "408";
        //        blazorApiResponse.message = ex.Message;
        //        _logger.LogError(ex.StackTrace);
        //    }
        //    return Ok(blazorApiResponse);
        //    // .ToArray();
        //}
        [HttpGet("submitonlineuser")]
        [HttpPost("submitonlineuser")]
        [Route("submitonlineuser")]
        //public async Task<ActionResult> submitOnlineUser([FromBody] OnlineUserViewModel onvm)
        //{
        //    BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
        //    if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
        //    try
        //    {
                
        //        OnlineuserModel oumdl =await _onlineUsersService.GetOnlineUserByIdAsync(onvm.UserId);
        //        if (oumdl == null)
        //        {
        //            blazorApiResponse.data= await _onlineUsersService.Create(new OnlineuserModel { LoginTime = GlobalUTIL.CurrentDateTime, MachineIp = ""+Request.HttpContext.Connection.RemoteIpAddress, Status = onvm.Status, LogoutTime = null, UserId = onvm.UserId });
        //            blazorApiResponse.status = true;
        //        }
        //        else {
        //            if(onvm.Status==1)
        //                await _onlineUsersService.Update(new OnlineuserModel {Id= onvm.Id, LoginTime = GlobalUTIL.CurrentDateTime, MachineIp = "" + Request.HttpContext.Connection.RemoteIpAddress, Status = onvm.Status, LogoutTime = null, UserId = onvm.UserId });
        //            else
        //                await _onlineUsersService.Update(new OnlineuserModel { Id = onvm.Id, LoginTime = oumdl.LoginTime, MachineIp = "" + Request.HttpContext.Connection.RemoteIpAddress, Status = onvm.Status, LogoutTime = GlobalUTIL.CurrentDateTime, UserId = onvm.UserId });
        //            blazorApiResponse.data = onvm;
        //            blazorApiResponse.status = true;
        //        }
               
        //    }
        //    catch (Exception ex)
        //    {
        //        blazorApiResponse.status = false;
        //        blazorApiResponse.errorCode = "408";
        //        blazorApiResponse.message = ex.Message;
        //        _logger.LogError(ex.StackTrace);
        //    }
        //    return Ok(blazorApiResponse);
        //    // .ToArray();
        //}
        [HttpGet("submitintegrationservice")]
        [HttpPost("submitintegrationservice")]
        [Route("submitintegrationservice")]
        //public async Task<ActionResult> subIntegrationAddUpdate([FromBody] IntegrationservicesettingViewModel ivm)
        //{
        //    BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
        //    if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
        //    try
        //    {

                
        //        if (ivm.Id <=0 )
        //        {                  
        //            ivm.CreatedAt = GlobalUTIL.CurrentDateTime;
        //            ivm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
        //            ivm.RowVer =  1;                    
        //            blazorApiResponse.data = await _integrationPageService.Create(ivm);
        //            blazorApiResponse.status = true;
        //        }
        //        else
        //        {
        //            IntegrationservicesettingViewModel oumdl = await _integrationPageService.GetByIdAsync(ivm.Id);
        //            ivm.CreatedBy= oumdl.CreatedBy;
        //            ivm.CreatedAt = oumdl.CreatedAt;
        //            ivm.RowVer = oumdl.RowVer + 1;
        //            ivm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
        //            await _integrationPageService.Update(ivm);
        //            blazorApiResponse.status = true;
        //            blazorApiResponse.data = ivm;
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        blazorApiResponse.status = false;
        //        blazorApiResponse.errorCode = "408";
        //        blazorApiResponse.message = ex.Message;
        //        _logger.LogError(ex.StackTrace);
        //    }
        //    return Ok(blazorApiResponse);
        //    // .ToArray();
        //}
        #endregion
        #region "Submit Common Data"

        // [HttpGet("logout")]
        [HttpPost("logout")]
        [Route("logout")]
        public async Task<BlazorResponseViewModel> logOut()
        {
            BlazorResponseViewModel blazorResponseViewModel = new BlazorResponseViewModel();
           // ViewBag.returnUrl = string.Empty;
            try
            {
               Int32 UserId = Convert.ToInt32(this.User.Claims.Where(x => x.Type == "UserId").FirstOrDefault().Value);// _cache.Remove(this.User.Claims.Where(x=>x.Type== "UserId").FirstOrDefault().Value);               
               await _notificationPageService.loggedOut(_httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(), UserId);
                // Record log out activity              
                await _appLogPageService.ProcessLoginActivity(UserId, LOGIN_ACTIVITY.LOGGED_OUT, "" + Request.HttpContext.Connection.RemoteIpAddress);
                blazorResponseViewModel.data = "";
                blazorResponseViewModel.status = true;
                _cache.Remove(this.User.Claims.Where(x => x.Type == "UserId").FirstOrDefault().Value);
                await _httpContextAccessor.HttpContext.SignOutAsync(BlazorConstant.COOKIES_AUTHENTICATION_KEY);
                blazorResponseViewModel.status = true;
            }
            catch (Exception ex)
            {
                blazorResponseViewModel.message = ex.Message;
                blazorResponseViewModel.status = false;
            }
            return blazorResponseViewModel;

        }
        // [HttpGet("login")]
        [HttpPost("login")]
        [Route("login")]
        // [AllowAnonymous]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<BlazorResponseViewModel> logIn(string email, string password)
        {
            //string retrunURl = Request.Query["ReturnURL"];
            BlazorResponseViewModel blazorResponseViewModel = new BlazorResponseViewModel();
            try
            {
                string ipAddress = "" + Request.HttpContext.Connection.RemoteIpAddress;
                LoginViewModel lvm = await _blazorRepoPageService.GetUserVerificationData(new UserViewModel { Email = ("" + email).Trim(), RoleId = (int)COMMON_STATUS_ALL.ALL, Password = GlobalUTIL.Encrypt(("" + password).Trim(), true, BlazorConstant.SECKEY) });

                if (lvm != null)
                {
                    GlobalSettings.loginRoleName = lvm.UserRole;
                    GlobalSettings.loginRoleId = lvm.RoleId;
                    GlobalSettings.loginUserName = lvm.FullName;
                    GlobalSettings.loginUserId = lvm.Id;
                  //  GlobalSettings.LoginUserCityId = lvm.UserCityId;
                   // GlobalSettings.loginAvatar = lvm.Avatar;
                   // GlobalSettings.LoginUserStateId = lvm.UserStateId;
                   // GlobalSettings.LoginUserContact = lvm.UserContact;

                  //  GlobalSettings.DspName = lvm.DspName;
                    //GlobalSettings.VAT_TAXID = lvm.VAT_NTN;
                  //  GlobalSettings.DspStateName = lvm.DspStateName;
                    GlobalSettings.OrgEmail = lvm.Email;
                  //  GlobalSettings.DspLogoPath = lvm.DspLogo;
                    //BasicConfigurationsViewModel.default_show_room_id = lvm.ShowRoomStateId;
                  //  GlobalSettings.DspStateName = lvm.DspStateName;
                  //  GlobalSettings.LoginUserContact = lvm.UserContact.Replace("+", "00");
                    GlobalSettings.LoginUserEmail = lvm.Email;
                   // GlobalSettings.DspCityName = lvm.DspCityName;
                  //  GlobalSettings.TradeName = lvm.TradeName;
                    //GlobalSettings.ShowRoomCurrency = lvm.ShowRoomCurrency;
                    // {
                    if (lvm.UserStatus == (int)COMMON_STATUS.ACTIVE && ((lvm.AlreadyLoginStatus != (int)LOGIN_ACTIVITY.LOGGED_IN || (lvm.AlreadyLoginStatus == (int)LOGIN_ACTIVITY.LOGGED_IN && lvm.LoginMachineIp == ipAddress)) || GlobalUTIL.CurrentDateTime.Subtract(lvm.LoginTime).TotalHours >= 8))
                    {
                        var userClaims = new List<Claim>()
                    {
                        new Claim("UserName",(""+lvm.FullName).Trim()),
                        new Claim("UserId",""+lvm.Id),
                        new Claim("RoleId",(""+lvm.RoleId).Trim()),
                      //  new Claim("DspId",(""+lvm.DspId).Trim()),
                      //  new Claim(ClaimTypes.Name,(lvm.userName).Trim()),
                        new Claim(ClaimTypes.Email,(""+lvm.Email).Trim()),
                        new Claim(ClaimTypes.DateOfBirth,GlobalUTIL.CurrentDateTime.ToLongDateString() ),
                        new Claim(ClaimTypes.Role, (lvm.UserRole).Trim())
                     };
                        GlobalUTIL.loadConfigurations(lvm.Id);
                        var userIdentity = new ClaimsIdentity(userClaims, BlazorConstant.USER_IDENTTITY);

                        var userPrincipal = new ClaimsPrincipal(new[] { userIdentity });
                        await _httpContextAccessor.HttpContext.SignInAsync(BlazorConstant.COOKIES_AUTHENTICATION_KEY, userPrincipal);
                        UserViewModel uvm = new UserViewModel { Id = lvm.Id, Email = lvm.Email, RoleId = lvm.RoleId, FirstName = lvm.FullName};
                        // LoadUserDataForApplicationUser(usrvm); _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString()
                        _cache.Set("" + lvm.Id, uvm);

                        await _notificationPageService.loggedIn(uvm, ipAddress);
                        await _appLogPageService.ProcessLoginActivity(lvm.Id, LOGIN_ACTIVITY.LOGGED_IN, ipAddress);
                        blazorResponseViewModel.data = lvm;
                        blazorResponseViewModel.id = lvm.Id;
                        blazorResponseViewModel.keyValue = ("" + lvm.RoleId).Trim();
                        blazorResponseViewModel.message = String.Format("Welcome <b>{0}</b> to {1} - successfully logged in!", lvm.FullName);
                        blazorResponseViewModel.status = true;
                    }
                    else if (lvm.UserStatus == (int)COMMON_STATUS.ACTIVE && lvm.AlreadyLoginStatus == (int)LOGIN_ACTIVITY.LOGGED_IN)
                    {
                        blazorResponseViewModel.message = "Failed- already logged in from another machine!";
                        blazorResponseViewModel.status = false;
                    }
                    else if (lvm.UserStatus != (int)COMMON_STATUS.ACTIVE)
                    {
                        blazorResponseViewModel.message = "Failed- account dormant,for access need to contact administrator!";
                        blazorResponseViewModel.status = false;
                    }
                }
                else
                {
                    blazorResponseViewModel.status = false;
                    blazorResponseViewModel.message = "Failed- user name or password incorrect or user does not belong to this role!";
                }
                if (!string.IsNullOrWhiteSpace(HttpContext.Request.Query["returnUrl"]))
                    blazorResponseViewModel.returnURL = HttpContext.Request.Query["returnUrl"];

                // Record log out activity
            }
            catch (Exception ex)
            {
                blazorResponseViewModel.message = string.Format(BlazorConstant.UPDATE_FAILED, "", (ex.InnerException == null ? ex.Message : ex.InnerException.Message)); ;
                blazorResponseViewModel.status = false;
            }
            // return Redirect(Url.Action("Dashboard_5", "Dashboards")); //
            //  return View(Url.Action("Dashboard_5", "Dashboards"));
            return blazorResponseViewModel;
        }
        [HttpGet("smtptestrun")]
        [HttpPost("smtptestrun")]
        [Route("smtptestrun")]
        //public async Task<ActionResult> SubSmtpTestRun([FromBody] BasicConfigurationModel model)
        //{
        //    //string retrunURl = Request.Query["ReturnURL"];
        //    BlazorResponseViewModel response = new BlazorResponseViewModel();
        //    if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorResponseViewModel { status = false, id=1,   effectedRows = 0, data = "Authorization Failed" });
        //    try
        //    {
        //         await _blazorUtilPageService.GenerateTestSMTPSettings(new BasicConfigurationViewModel { Id= model.Id, ApiAuthKey= model.ApiAuthKey, CreatedAt = model.CreatedAt, LastUpdatedAt = model.LastUpdatedAt, DefaultDspid = model.DefaultDspid, Smtpport = model.Smtpport, SmtpServer = model.SmtpServer, SmtpSenderEmail = model.SmtpSenderEmail, Sslenabled = model.Sslenabled, SmtpUser = model.SmtpUser, SmtpUserPwd = model.SmtpUserPwd, IsProxyEnabled = model.IsProxyEnabled, CreatedBy= model .CreatedBy});
        //        response.data = model;
        //        response.status = true;
        //        response.message = string.Format(BlazorConstant.INSERTED_SUCCESS, model.SmtpServer, "Email settings are successful ");
        //        // Record log out activity
        //    }
        //    catch (Exception ex)
        //    {
        //        response.message = "Email Test Run Failed -  Error detail " + ex.InnerException.Message; 
        //        response.status = false;
        //    }
        //    // return Redirect(Url.Action("Dashboard_5", "Dashboards")); //
        //    //  return View(Url.Action("Dashboard_5", "Dashboards"));
        //    return Ok(response);
        //}
        [HttpGet("submitshift")]
        [HttpPost("submitshift")]
        [Route("submitshift")]
        //public async Task<ActionResult> submitShiftData([FromBody] ShiftModel mdl)
        //{
        //    //string retrunURl = Request.Query["ReturnURL"];
        //    BlazorResponseViewModel response = new BlazorResponseViewModel();
        //    if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorResponseViewModel { status = false, id = 1, effectedRows = 0, data = "Authorization Failed" });
        //    try
        //    {
        //        // await _blazorUtilPageService.GenerateTestSMTPSettings(new BasicConfigurationViewModel { Id = model.Id, ApiAuthKey = model.ApiAuthKey, CreatedAt = model.CreatedAt, LastUpdatedAt = model.LastUpdatedAt, DefaultDspid = model.DefaultDspid, Smtpport = model.Smtpport, SmtpServer = model.SmtpServer, SmtpSenderEmail = model.SmtpSenderEmail, Sslenabled = model.Sslenabled, SmtpUser = model.SmtpUser, SmtpUserPwd = model.SmtpUserPwd, IsProxyEnabled = model.IsProxyEnabled, CreatedBy = model.CreatedBy });
        //        if (mdl != null && mdl.id <= 0)
        //        {
                  
        //            mdl.RowVer = 1;
        //            mdl.CreatedBy = mdl.CreatedBy;
        //            mdl.CreatedAt = GlobalUTIL.CurrentDateTime;
        //            mdl.LastUpdatedBy = mdl.LastUpdatedBy;
        //            mdl.LastUpdatedAt = GlobalUTIL.CurrentDateTime;

        //            response.data = await _shiftsService.Create(mdl);
        //            response.message = string.Format(BlazorConstant.INSERTED_SUCCESS, mdl.Name, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));
        //        }
        //        else if(mdl != null)
        //        {
                    
        //            mdl.RowVer = mdl.RowVer + 1;
        //            mdl.LastUpdatedBy = mdl.LastUpdatedBy;
        //            mdl.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
        //            await _shiftsService.Update(mdl);
        //            response.data = mdl;
        //            response.message = string.Format(BlazorConstant.UPDATED_SUCCESS, mdl.Name, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));
        //        }
        //        //response.data = mdl;
        //        response.status = true;
        //        response.message = string.Format(BlazorConstant.INSERTED_SUCCESS, mdl.Name, "Email settings are successful ");
        //        // Record log out activity
        //    }
        //    catch (Exception ex)
        //    {
        //        response.message = "Email Test Run Failed -  Error detail " + ex.InnerException.Message;
        //        response.status = false;
        //    }
        //    // return Redirect(Url.Action("Dashboard_5", "Dashboards")); //
        //    //  return View(Url.Action("Dashboard_5", "Dashboards"));
        //    return Ok(response);
        //}

        [HttpPost("submitgrouprights")]
        [Route("submitgrouprights")]
        // [AllowAnonymous]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<BlazorResponseViewModel> SubmitGroupsRights([FromBody] List<RolerightViewModel> lrts)
        {
            //string retrunURl = Request.Query["ReturnURL"];
            BlazorResponseViewModel blazorResponseViewModel = new BlazorResponseViewModel();
            try
            {
                string ipAddress = "" + Request.HttpContext.Connection.RemoteIpAddress;
                blazorResponseViewModel= await _blazorRepoPageService.AddUpdateRoleRights(lrts);
                if (blazorResponseViewModel.status)
                {
                    blazorResponseViewModel.status = true;
                    blazorResponseViewModel.message = String.Format(BlazorConstant.UPDATED_SUCCESS, "Role Rights", GlobalUTIL.CurrentDateTime);
                }
                //// LoginViewModel lvm = await _blazorRepoPageService.GetUserVerificationData(new LoginViewModel { Email = ("" + email).Trim(), RoleId = (int)UTIL.COMMON_STATUS_ALL.ALL, Password = GlobalUTIL.Encrypt(("" + password).Trim(), true, BlazorConstant.SECKEY) });

                //var opt = new JsonSerializerOptions() { WriteIndented = true };
                //string rightsJson = JsonSerializer.Serialize<List<RolerightViewModel>>(lrts, opt);
                ////  JSON

                //List<MySqlParameter> parameter = new List<MySqlParameter>();
                //MySqlParameter pJSON = new MySqlParameter("@rightsjson", SqlDbType.NVarChar);
                //pJSON.Value = rightsJson;
                //parameter.Add(pJSON);

                ////if (lvm != null)
                ////{
                ////    GlobalSettings.loginRoleName = lvm.UserRole;
                ////    GlobalSettings.loginRoleId = lvm.RoleId;
                ////    GlobalSettings.loginUserName = lvm.FullName;
                ////    GlobalSettings.loginUserId = lvm.Id;
                ////    GlobalSettings.LoginUserCityId = lvm.UserCityId;
                ////    GlobalSettings.loginAvatar = lvm.Avatar;
                ////    GlobalSettings.LoginUserStateId = lvm.UserStateId;
                ////    GlobalSettings.LoginUserContact = lvm.UserContact;

                ////    GlobalSettings.DspName = lvm.DspName;
                ////    //GlobalSettings.VAT_TAXID = lvm.VAT_NTN;
                ////    GlobalSettings.DspStateName = lvm.DspStateName;
                ////    GlobalSettings.DspEmail = lvm.Email;
                ////    GlobalSettings.DspLogoPath = lvm.DspLogo;
                ////    //BasicConfigurationsViewModel.default_show_room_id = lvm.ShowRoomStateId;
                ////    GlobalSettings.DspStateName = lvm.DspStateName;
                ////    GlobalSettings.LoginUserContact = lvm.UserContact.Replace("+", "00");
                ////    GlobalSettings.LoginUserEmail = lvm.Email;
                ////    GlobalSettings.DspCityName = lvm.DspCityName;
                ////    GlobalSettings.TradeName = lvm.TradeName;
                ////    //GlobalSettings.ShowRoomCurrency = lvm.ShowRoomCurrency;
                ////    // {
                ////    if (lvm.UserStatus == (int)UTIL.COMMON_STATUS.ACTIVE && ((lvm.AlreadyLoginStatus != (int)UTIL.LOGIN_ACTIVITY.LOGGED_IN || (lvm.AlreadyLoginStatus == (int)UTIL.LOGIN_ACTIVITY.LOGGED_IN && lvm.LoginMachineIp == ipAddress)) || GlobalUTIL.CurrentDateTime.Subtract(lvm.LoginTime).TotalHours >= 8))
                ////    {
                ////        var userClaims = new List<Claim>()
                ////    {
                ////        new Claim("UserName",(""+lvm.FullName).Trim()),
                ////        new Claim("UserId",""+lvm.Id),
                ////        new Claim("RoleId",(""+lvm.RoleId).Trim()),
                ////        new Claim("DspId",(""+lvm.DspId).Trim()),
                ////        new Claim(ClaimTypes.Name,(lvm.userName).Trim()),
                ////        new Claim(ClaimTypes.Email,(""+lvm.Email).Trim()),
                ////        new Claim(ClaimTypes.DateOfBirth,GlobalUTIL.CurrentDateTime.ToLongDateString() ),
                ////        new Claim(ClaimTypes.Role, (lvm.UserRole).Trim())
                ////     };
                ////        GlobalUTIL.loadConfigurations(lvm.DspId);
                ////        var userIdentity = new ClaimsIdentity(userClaims, BlazorConstant.USER_IDENTTITY);

                ////        var userPrincipal = new ClaimsPrincipal(new[] { userIdentity });
                ////        //await _httpContextAccessor.HttpContext.SignInAsync(BlazorConstant.COOKIES_AUTHENTICATION_KEY, userPrincipal);
                ////        UserViewModel uvm = new UserViewModel { Id = lvm.Id, Email = lvm.Email, Avatar = lvm.Avatar, RoleId = lvm.RoleId, UserName = lvm.userName, FirstName = lvm.FullName, PrimaryContact = lvm.UserContact, StateId = lvm.UserStateId };
                ////        // LoadUserDataForApplicationUser(usrvm); _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString()
                ////        _cache.Set("" + lvm.Id, uvm);

                ////        await _notificationPageService.loggedIn(lvm, ipAddress);
                ////        await _appLogPageService.ProcessLoginActivity(lvm.Id, UTIL.LOGIN_ACTIVITY.LOGGED_IN, ipAddress);
                ////        blazorResponseViewModel.data = lvm.UserRole;
                ////        blazorResponseViewModel.keyValue = ("" + lvm.RoleId).Trim();
                ////        blazorResponseViewModel.message = String.Format("Welcome to {0} - Successfully logged in!", GlobalSettings.DspName);
                ////        blazorResponseViewModel.status = true;
                ////    }
                ////    else if (lvm.UserStatus == (int)UTIL.COMMON_STATUS.ACTIVE && lvm.AlreadyLoginStatus == (int)UTIL.LOGIN_ACTIVITY.LOGGED_IN)
                ////    {
                ////        blazorResponseViewModel.message = "Failed- Already logged in from another machine!";
                ////        blazorResponseViewModel.status = false;
                ////    }
                ////    else if (lvm.UserStatus != (int)UTIL.COMMON_STATUS.ACTIVE)
                ////    {
                ////        blazorResponseViewModel.message = "Failed- Account dormant,for access need to contact administrator!";
                ////        blazorResponseViewModel.status = false;
                ////    }
                ////}
                ////else
                ////{
                ////    blazorResponseViewModel.status = false;
                ////    blazorResponseViewModel.message = "Failed- User name or password incorrect or user does not belong to this role!";
                ////}
                if (!string.IsNullOrWhiteSpace(HttpContext.Request.Query["returnUrl"]))
                    blazorResponseViewModel.returnURL = HttpContext.Request.Query["returnUrl"];

                // Record log out activity
            }
            catch (Exception ex)
            {
                blazorResponseViewModel.message = string.Format(BlazorConstant.UPDATE_FAILED, "", (ex.InnerException == null ? ex.Message : ex.InnerException.Message)); ;
                blazorResponseViewModel.status = false;
            }
            // return Redirect(Url.Action("Dashboard_5", "Dashboards")); //
            //  return View(Url.Action("Dashboard_5", "Dashboards"));
            return blazorResponseViewModel;
        }
        #endregion
    }

}


