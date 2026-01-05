using Blazor.Web.UI.Interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.infrastructure;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Data;

namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class BlazorApiController : ControllerBase
    { //Almas 
        private IMemoryCache _cache;
        private readonly ILogger<BlazorApiController> _logger;
        private readonly IOrgPageService _orgPageService;
        private readonly IBlazorUtilPageService _utilPageService;
        // private readonly IProductPageService _productPageService;
        private readonly IMediaContentPageService _mediaContentPageService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;
        private readonly IAppLogPageService _appLogPageService;
        private readonly IUsersPageService _userPageService;
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        string applicationPath = string.Empty;
        private _bmtContext? dbContext;
        public BlazorApiController(IBlazorUtilPageService utilPageService ,Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IMediaContentPageService mediaContentPageService, IAppLogPageService appLogPageService, IBlazorRepoPageService blazorRepoPageService, IOrgPageService orgPageService, IUsersPageService userPageService,  ILogger<BlazorApiController> logger,  IMemoryCache cache)
        {
            _logger = logger;
            // _Configuration = configuration; 
            this.dbContext = new _bmtContext();
            _cache = cache;
            _utilPageService = utilPageService ?? throw new ArgumentNullException(nameof(utilPageService));

            _orgPageService = orgPageService ?? throw new ArgumentNullException(nameof(orgPageService));
            _userPageService = userPageService ?? throw new ArgumentNullException(nameof(userPageService));
           // _productPageService = productPageService ?? throw new ArgumentNullException(nameof(productPageService));
            _mediaContentPageService = mediaContentPageService ?? throw new ArgumentNullException(nameof(mediaContentPageService));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _appLogPageService = appLogPageService ?? throw new ArgumentNullException(nameof(appLogPageService));
            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
            applicationPath = _hostingEnvironment.ContentRootPath;
            _logger.LogInformation("Web Api Service Started  at - " + System.DateTime.Now.ToLongTimeString());
        }       
        [HttpGet]
        ////[Authorize]
        public ActionResult Get()
        {
            _cache.Get((this.User == null || this.User.Claims.Where(x => x.Type == "UserId").FirstOrDefault() == null) ? "0" : this.User.Claims.Where(x => x.Type == "UserId").FirstOrDefault().Value);
            _logger.LogInformation("Data fetch request recieved");

            return Ok( this.dbContext.Users.ToList());
        }////     
        
        [HttpGet("userandorgusers")]
        [HttpPost("userandorgusers")]
        [Route("userandorgusers")]
        public async Task<ActionResult> GetUserDetails([FromBody] WebApiFilters filter)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                blazorApiResponse.data= await _userPageService.GetUsersBySearchFiltersAsync(string.IsNullOrWhiteSpace(filter.roleId) ? 0 : Convert.ToInt32(filter.roleId) , filter.name, string.IsNullOrWhiteSpace(filter.status)?0: Convert.ToInt32(filter.status), GlobalUTIL.CurrentDateTime.AddYears(-2),  GlobalUTIL.CurrentDateTime );
                blazorApiResponse.errorCode = "200";
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
        [HttpGet("campaignrecipients")]
        [HttpPost("campaignrecipients")]
        [Route("campaignrecipients")]
        public async Task<ActionResult> GetCampaignRecipientsList([FromBody] CampaignRecipientsViewModel filter)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                blazorApiResponse.data = await _blazorRepoPageService.GetCampaignRecipientsData(filter);
                blazorApiResponse.errorCode = "200";
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
        [HttpGet]
        [HttpPost]
        [Route("log")]
        public async Task<ActionResult> GetApplicationLogDetails([FromBody] WebApiFilters filter)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                blazorApiResponse.data = await _appLogPageService.GetAppLogs(""+filter.name);
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
        //[HttpPost]
        //[HttpGet]
		[HttpPost("notificationsreportdata")]
		[HttpGet("notificationsreportdata")]
		[Route("notificationsreportdata")]
		public async Task<ActionResult> GetCampaignNotificationReportData([FromBody] CampaignNotificationViewModel vm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) ||
                Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)
            {
                return Ok(new BlazorApiResponse
                {
                    status = false,
                    errorCode = "201",
                    message = "Authorization Failed"
                });
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

        [HttpGet]
        [HttpPost]
        [Route("users")]
        public async Task<ActionResult> GetUsersData([FromBody] UserViewModel usr)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                blazorApiResponse.data = await _blazorRepoPageService.GetBMTUsersListAsync(usr.Id, Convert.ToInt32(usr.OrgId), usr.RoleId, usr.UserName, usr.Status, usr.CreatedAt, usr.LastUpdatedAt==null?GlobalUTIL.CurrentDateTime: Convert.ToDateTime(usr.LastUpdatedAt));
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
        [HttpGet("userexists")]
        [HttpPost("userexists")]
        [Route("userexists")]
        public async Task<ActionResult> GetUserExistatance([FromBody] WebApiFilters mdl)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                blazorApiResponse.data = await _userPageService.GetUserByEmailSync(string.IsNullOrWhiteSpace(mdl.roleId)?Convert.ToInt16(mdl.roleId):0, mdl.email);
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
        //[HttpGet]
        //[HttpPost]
        //[Route("products")]
        //public async Task<ActionResult> GetProducts([FromBody] ProductViewModel model)
        //{
        //    BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
        //    // List<User> cstrs = new List<User>();
        //    if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
        //    try
        //    {
        //        blazorApiResponse.data = await _productPageService.GetProductsAllFiltersAsync(model);
        //        blazorApiResponse.status = true;
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
        [HttpGet("orgs")]
        [HttpPost("orgs")]
        [Route("orgs")]
        //public async Task<ActionResult> GetDspsListAsync([FromBody] DspViewModel vmdl)
        public async Task<ActionResult> GetDspsListAsync()
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {

                blazorApiResponse.data = await _orgPageService.GetOrgsByName("");//.ToListAsync();
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

        #region "Partners"
        //[HttpGet("dspspartners")]
        //[HttpPost("dspspartners")]
        //[Route("dspspartners")]
        ////public async Task<ActionResult> GetDspsListAsync([FromBody] DspViewModel vmdl)
        //public async Task<ActionResult> GetDspPartnersListAsync([FromBody] WebApiFilters filters)
        //{
        //    BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
        //    if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
        //    try
        //    {
        //        blazorApiResponse.data = await _dspPageService.DspPartnerList(Convert.ToInt32(filters.dspid), Convert.ToInt32(filters.status));//.ToListAsync();
        //        blazorApiResponse.status = true;
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
        [HttpGet("orgsfulldata")]
        [HttpPost("orgsfulldata")]
        [Route("orgsfulldata")]
        //public async Task<ActionResult> GetDspsListAsync([FromBody] DspViewModel vmdl)
        public async Task<ActionResult> GetOrgsFullDataListAsync([FromBody] OrganizationViewModel model)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {

                blazorApiResponse.data = await _blazorRepoPageService.GetOrganizationsData(model);//.ToListAsync();
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
		
		//[HttpGet]
		//[HttpPost]
		//[Route("addupdateproduct")]
		//public async Task<ActionResult> UpdateProduct([FromBody] ProductViewModel pvm)
		//{
		//    BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
		//    // List<User> cstrs = new List<User>();
		//    if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
		//    try
		//    {
		//        if (pvm != null && pvm.Id <= 0)
		//        {
		//            pvm.CreatedAt = GlobalUTIL.CurrentDateTime;
		//            pvm.CreatedBy = pvm.LastUpdatedBy;
		//            pvm.RowVer = 1;
		//            pvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
		//            pvm.LastUpdatedBy = pvm.LastUpdatedBy;
		//            blazorApiResponse.data= await _productPageService.Create(pvm);
		//        }
		//        else {
		//           var dbProduct= await _productPageService.GetProductByIdAsync(pvm.Id);
		//            pvm.CreatedBy = dbProduct.CreatedBy;
		//            pvm.CreatedAt = dbProduct.CreatedAt;
		//            pvm.RowVer = dbProduct.RowVer+1;
		//            pvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
		//            pvm.LastUpdatedBy = pvm.LastUpdatedBy;
		//           await _productPageService.Update(pvm);
		//            blazorApiResponse.data = pvm;
		//        }          
		//        blazorApiResponse.message = string.Format("User {0} has been saved", pvm.Name);
		//        blazorApiResponse.status = true;                
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
		[HttpPost]
        [Route("updateuser")]
        public async Task<ActionResult> UpdateOrgUser([FromBody] UserViewModel uvm)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                if (uvm != null && uvm.Id <= 0)
                {
                    if (uvm.OrgId <= 0 && !string.IsNullOrWhiteSpace(uvm.OrgName))
                    {
                        OrganizationViewModel org = new OrganizationViewModel();
                        org.CreatedAt = GlobalUTIL.CurrentDateTime;
                        org.Contact = uvm.Contact;
                        org.Email = uvm.Email;
                        org.Name = uvm.OrgName;
                        org.Address = uvm.Address?? uvm.CompleteName;
                        org.CityId = uvm.CityId;// ?? uvm.CompleteName;
                        org.CurrencyId = util.BlazorConstant.DEFAULT_CURRENCY;
                        org.CreatedBy = (uvm.LastUpdatedBy == null || uvm.LastUpdatedBy == 0) ? GlobalBasicConfigurationsViewModel.DefaultPublicUserId : uvm.LastUpdatedBy;
                        org.LastUpdatedBy = (uvm.LastUpdatedBy == null || uvm.LastUpdatedBy == 0) ? GlobalBasicConfigurationsViewModel.DefaultPublicUserId : uvm.LastUpdatedBy;
                        org.RowVer = 1;
                        org.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                        //dvm.LastUpdatedBy = dvm.LastUpdatedBy;
                        OrganizationViewModel urg = await _orgPageService.Create(org);
                        if (urg != null && urg.Status == 1)
                        {
                            await _utilPageService.sendOrgRegistrationEmailNotfification(urg.Id, "" + urg.Email, "" + urg.Name);
                        }
                        uvm.OrgId = urg.Id;
                    }
                   // blazorApiResponse.data = urg;



                    uvm.CreatedAt = GlobalUTIL.CurrentDateTime;
                    uvm.CreatedBy = uvm.LastUpdatedBy;
                    //uvm.VerificationMethod = uvm.VerificationMethod==null?0: uvm.VerificationMethod;            
                    //uvm.HasValidDrivingLicense = uvm.HasValidDrivingLicense == null ? 0 : uvm.HasValidDrivingLicense;
                    uvm.RegistrationSource = uvm.RegistrationSource==null?0: uvm.RegistrationSource;
                    uvm.RowVer = 1;
                    uvm.UserName= string.IsNullOrWhiteSpace(uvm.UserName) ? uvm.Email.Split("@")[0] : uvm.UserName;
                   // uvm.Token = string.IsNullOrWhiteSpace(uvm.Token) ? ""+(new Random()).NextInt64(100000,99999999) : uvm.Token;
                    uvm.Password=GlobalUTIL.Encrypt(string.IsNullOrWhiteSpace(uvm.Password) ? uvm.Password : System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(("" + uvm.Password).Trim())), true, BlazorConstant.SECKEY);
                    uvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    uvm.LastUpdatedBy = uvm.LastUpdatedBy;
                    blazorApiResponse.data = await _userPageService.CreateUser(uvm);
                }
                else
                {
                    var usr = await _userPageService.GetUserById(uvm.Id);
                    uvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    uvm.Status = (uvm.Status==0? usr.Status: uvm.Status);
                    uvm.CreatedAt = usr.CreatedAt;
                    uvm.CreatedBy = usr.CreatedBy;
                    uvm.RowVer = usr.RowVer + 1;
                    //uvm.VerificationMethod = usr.VerificationMethod;
                    uvm.Fmctoken = usr.Fmctoken;
                   // uvm.Token = string.IsNullOrWhiteSpace(uvm.Token)?usr.Token: uvm.Token;
                    uvm.Password = usr.Password;
                    uvm.UserName = string.IsNullOrWhiteSpace(uvm.UserName) ? usr.UserName : uvm.UserName;
                    // uvm.HasValidDrivingLicense = uvm.HasValidDrivingLicense == null? usr.HasValidDrivingLicense: uvm.HasValidDrivingLicense;
                    uvm.RegistrationSource = usr.RegistrationSource;
                    //uvm.CreatedBy = usr.CreatedBy;
                    uvm.RowVer = usr.RowVer + 1;
                   // uvm.Password=  GlobalUTIL.Encrypt(string.IsNullOrWhiteSpace(uvm.Password) ? uvm.Password:System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String((""+uvm.Password).Trim())), true, BlazorConstant.SECKEY);
                    await _userPageService.UpdateUser(uvm);
                    blazorApiResponse.data = uvm;
                }
                //usr.de = uvm.status;
               // blazorApiResponse.data = uvm;
                blazorApiResponse.message = string.Format("User {0} has been saved", ("" + uvm.LastName + " " + uvm.FirstName));
                blazorApiResponse.status = true;
            }
            catch (AggregateException ex)
            {
                blazorApiResponse.status = false;
                blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.InnerException.InnerException.Message.ToLower().Contains("duplicate")? string.Format("email {0} is already associated with some other account", "" + uvm.Email): ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.InnerException.Message.ToLower().Contains("duplicate") ? string.Format("email {0} is already associated with some other account", "" + uvm.Email) : ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return Ok(blazorApiResponse);
            // .ToArray();
        }
        [HttpPost]
        [Route("deletaccount")]
        public async Task<BlazorResponseViewModel> DeleteUserAccountRequest([FromBody] UserViewModel user)
        {
            string emailOrloginName = string.IsNullOrWhiteSpace(user.Email) ? user.UserName : user.Email;
            BlazorResponseViewModel BlazorResponseViewModel = new BlazorResponseViewModel();

            try
            {
                var alreadySent = _cache.Get(util.BlazorConstant.CACHE_KEY_FORGOTPWD + "_" + emailOrloginName);

                if (alreadySent == null || (Convert.ToInt32(user.Status) == (int)util.STATUS_USERS.DELETED))
                {
                    int StoreId = Convert.ToInt32(this.User.Claims.FirstOrDefault(x => x.Type == "OrgId")?.Value ?? "0");
                    if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.FirstOrDefault(x => x.OrgId == StoreId) == null)
                        GlobalUTIL.loadConfigurations(StoreId);

                    UserViewModel uvm = await _userPageService.GetUserByEmailOrLoginNameAsynch(
                        emailOrloginName,
                        Convert.ToInt32(user.Status) == (int)util.STATUS_USERS.ACTIVE ? "" : user.SecurityToken
                    );

                    if (uvm != null)
                    {
                        if (Convert.ToInt32(user.Status) == (int)util.STATUS_USERS.DELETED)
                        {
                            // ✅ Security token present → delete user
                            if (uvm.SecurityToken == user.SecurityToken)
                            {
                                try
                                {
                                    await _userPageService.DeleteUser(uvm); // Actually delete
                                    BlazorResponseViewModel.message = string.Format(
                                        util.BlazorConstant.ACCOUNT_DELETE_EMAIL_SENT_SUCCESSFULLY,
                                        emailOrloginName,
                                        System.DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss")
                                    );
                                    BlazorResponseViewModel.status = true;
                                    BlazorResponseViewModel.data = null;
                                }
                                catch (DbUpdateException uexcep) {
                                    uvm.Status = (int)util.STATUS_USERS.DELETED;
                                    await _userPageService.UpdateUser(uvm);
                                    BlazorResponseViewModel.status = true;
                                }
                                catch (Exception ex)
                                {
                                    if (ex.InnerException != null && ex.InnerException.InnerException.Message.Contains("fk_compaigns_CreatedBy") )
                                    {

                                        uvm.Status = (int)util.STATUS_USERS.DELETED;
                                        await _userPageService.UpdateUser(uvm);
                                        BlazorResponseViewModel.status = true;
                                        BlazorResponseViewModel.message = string.Format("Account {0} has been deleted successfully", uvm.UserName);
                                    }
                                    else
                                    {
                                        BlazorResponseViewModel.message = string.Format(
                        util.BlazorConstant.UNSUBSCRIBE_EMAIL_FAILED,
                        emailOrloginName,
                        ex.InnerException?.Message ?? ex.Message
                    );
                                        BlazorResponseViewModel.status = false;
                                    }// Else
                                }
                                return BlazorResponseViewModel;
                            }
                            else
                            {
                                // Token mismatch
                                BlazorResponseViewModel.message = $"Security token mismatch for {emailOrloginName}.";
                                BlazorResponseViewModel.status = false;
                                return BlazorResponseViewModel;
                            }
                        }
                        else
                        {
                            // Token request → generate token and send
                            string token = string.IsNullOrWhiteSpace(user.SecurityToken)
                                ? (new Random()).Next(100000, 1000000).ToString()
                                : user.SecurityToken;

                            uvm.SecurityToken = token;
                            uvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                            uvm.RowVer += 1;
                            uvm.Remarks = user.Remarks;
                            await _userPageService.UpdateUser(uvm);

                            await _utilPageService.sendUnsubscribeEmailNotfification(
                                StoreId, uvm.Email, Convert.ToInt16(uvm.Status), token
                            );

                            var cacheOption = new MemoryCacheEntryOptions
                            {
                                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(BlazorConstant.REQUEST_INTERVAL_EMAIL_SECONDS)
                            };
                            _cache.Set(util.BlazorConstant.CACHE_KEY_FORGOTPWD + "_" + emailOrloginName,
                                System.Web.HttpUtility.HtmlEncode(token), cacheOption);

                            BlazorResponseViewModel.message = string.Format(
                                util.BlazorConstant.ACCOUNT_DELETE_TOKEN_SENT_SUCCESSFULLY,
                                emailOrloginName,
                                System.DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss")
                            );
                            BlazorResponseViewModel.status = true;
                            BlazorResponseViewModel.data = uvm;
                        }
                    }
                    else
                    {
                        BlazorResponseViewModel.status = false;
                        BlazorResponseViewModel.message = string.Format(
                            util.BlazorConstant.UNSUBSCRIBE_EMAIL_FAILED,
                            emailOrloginName,
                            "User does not exist or security token mismatch!"
                        );
                        return BlazorResponseViewModel;
                    }
                }
                else
                {
                    // Already requested recently
                    BlazorResponseViewModel.message = string.Format(
                        util.BlazorConstant.RESET_EMAIL_ALREADY_RECIEVED,
                        emailOrloginName,
                        "there must be 20 minutes between tries"
                    );
                    BlazorResponseViewModel.status = false;
                    return BlazorResponseViewModel;
                }
            }
            catch (Exception ex)
            {
                BlazorResponseViewModel.message = string.Format(
                    util.BlazorConstant.UNSUBSCRIBE_EMAIL_FAILED,
                    emailOrloginName,
                    ex.InnerException?.Message ?? ex.Message
                );
                BlazorResponseViewModel.status = false;
            }

            return BlazorResponseViewModel;
        }
        [HttpPost("useraccountwithlogin")]
        [RequestSizeLimit(209715200)]
        [RequestFormLimits(MultipartBodyLengthLimit = 209715200)]
        public async Task<ActionResult> AuthenticateMobileUserWithLogin([FromForm] IList<IFormFile> profiles)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            //List<VehiclesViewModel> plist = new List<VehiclesViewModel>();
            // plist.Add(sdtl);
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                Int32 orgId = 0;
                //  var previousRequest = _cache.Get(this.User.Identity.Name + Request.Path);
                // if (previousRequest == null) {
                try
                {
                 
                    byte[] buffer = new byte[16 * 1024];
                    //Int32 storeId = Convert.ToInt32(HttpContext.Request.Form["id"]);
                    string applicationPath = _hostingEnvironment.ContentRootPath;
                    string fileAbsolutePath = string.Empty;
                    string filenamewithlogo = string.Empty;
                   
                    if (profiles != null && profiles.Any())
                    {
                        foreach (IFormFile file in profiles)
                        {
                            long totalBytes = file.Length;
                            string filename = Guid.NewGuid().ToString() + "_" + Path.GetExtension(file.FileName);
                            fileAbsolutePath = applicationPath + BlazorConstant.UPLOAD_WEB_ROOT_UPLOADFOLDER + filename;
                            filenamewithlogo = BlazorConstant.UPLOAD_WEB_ROOT_UPLOADFOLDER + filename;
                            using (Stream readStream = file.OpenReadStream())
                            {
                                using (FileStream f = new FileStream(fileAbsolutePath, FileMode.Create))
                                {
                                    int readBytes;
                                    while ((readBytes = readStream.Read(buffer, 0, buffer.Length)) > 0)
                                    {
                                        f.Write(buffer, 0, readBytes);
                                    }
                                    f.Flush();
                                    f.Close();
                                }
                            }
                        }// File Logo
                    }// Images
                    UserViewModel usrdb= await  _userPageService.GetUserByEmailOrLoginNameAsynch("" + HttpContext.Request.Form["email"],string.Empty);
                    if (usrdb == null || usrdb.Id <= 0)
                    {
                        OrganizationViewModel urg = null;
                        var random = new Random();
                        //string sixDigit = random.Next(9908, 1000000).ToString("D6");

                        /*
                         Create Organization if its new and by new public user                       
                         */
                        if (Convert.ToInt32("" + HttpContext.Request.Form["orgid"]) <= 0 && !string.IsNullOrWhiteSpace("" + HttpContext.Request.Form["orgname"]))
                        {
                            OrganizationViewModel org = new OrganizationViewModel();
                            org.CreatedAt = GlobalUTIL.CurrentDateTime;
                            org.Contact = "" + HttpContext.Request.Form["contact"];
                            org.Email = "" + HttpContext.Request.Form["email"];
                            org.Name = "" + HttpContext.Request.Form["orgname"];
                            org.Address = "" + HttpContext.Request.Form["address"];
                            org.CityId = Convert.ToInt32("" + HttpContext.Request.Form["cityid"]);
                            org.CurrencyId = util.BlazorConstant.DEFAULT_CURRENCY;
                            org.CreatedBy = GlobalBasicConfigurationsViewModel.DefaultPublicUserId ;
                            org.LastUpdatedBy = GlobalBasicConfigurationsViewModel.DefaultPublicUserId;
                            org.RowVer = 1;
                            org.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                            //dvm.LastUpdatedBy = dvm.LastUpdatedBy;
                             urg = await _orgPageService.Create(org);
                            if (urg != null && urg.Status == 1)
                            {
                                await _utilPageService.sendOrgRegistrationEmailNotfification(urg.Id, "" + urg.Email, "" + urg.Name);
                            }
                           // uvm.OrgId = urg.Id;
                        }


                        usrdb = await _userPageService.CreateUser(
                            new UserViewModel
                            {
                                Id = 0,
                                UserName = "" + HttpContext.Request.Form["username"],
                                Password = "" + HttpContext.Request.Form["password"],
                                FirstName = string.IsNullOrWhiteSpace("" + HttpContext.Request.Form["firstname"]) ? "" + HttpContext.Request.Form["email"] : "" + HttpContext.Request.Form["firstname"],
                                LastName = string.IsNullOrWhiteSpace("" + HttpContext.Request.Form["lastname"]) ? "" + HttpContext.Request.Form["email"] : "" + HttpContext.Request.Form["lastname"],
                                Status = 1,
                                Email = "" + HttpContext.Request.Form["email"],
                                Contact = "" + HttpContext.Request.Form["contact"],
                                RowVer = 1,
                                SecurityToken = random.Next(9908, 1000000).ToString("D6"),
                                OrgId = Convert.ToInt32(HttpContext.Request.Form["orgid"])<=0? urg.Id: Convert.ToInt32(HttpContext.Request.Form["orgid"]),
                                RoleId = Convert.ToInt32(HttpContext.Request.Form["roleid"]),
                                UserCode = "" + HttpContext.Request.Form["usercode"],
                                Avatar = filenamewithlogo,
                                CreatedAt = GlobalUTIL.CurrentDateTime,
                                LastUpdatedAt = GlobalUTIL.CurrentDateTime,
                                CreatedBy = Convert.ToInt32(HttpContext.Request.Form["createdby"]),
                                LastUpdatedBy = Convert.ToInt32(HttpContext.Request.Form["createdby"])
                            }
                            );
                        blazorApiResponse.status = true;
                        blazorApiResponse.message = string.Format("User {0} created and auto logged in!!", "" + HttpContext.Request.Form["email"]);
                        blazorApiResponse.errorCode = "200";
                    }
                    else if (usrdb.Status != 1)
                    {
                        blazorApiResponse.status = false;
                        blazorApiResponse.errorCode = "405";
                        blazorApiResponse.message = string.Format("User {0} already exists and status is dormant!!!", "" + HttpContext.Request.Form["email"]);
                    }
                    else if (usrdb.Status ==(Int32) util.COMMON_STATUS.ACTIVE)
                    {
                        blazorApiResponse.status = true;
                        blazorApiResponse.errorCode = "200";
                        blazorApiResponse.message = string.Format("User {0} already exists and login is success!!!", "" + HttpContext.Request.Form["email"]);
                    }
                        if (blazorApiResponse.status) {
                        usrdb.Password = string.Empty;
                        blazorApiResponse.data = usrdb;
                        }
                                       
                }
                catch (Exception ex)
                {
                    blazorApiResponse.status = false;
                    blazorApiResponse.message = ex.Message;
                    throw ex;
                }

            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                // _logger.LogError(ex.StackTrace);
            }
            return Ok(blazorApiResponse);
            // .ToArray();
        }

        [HttpPost]
        [Route("updateuserstatus")]
        public async Task<ActionResult> UpdateUserStatus([FromBody] UserViewModel uvm)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                var usr = await _userPageService.GetUserById(uvm.Id);
                uvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                uvm.LastUpdatedBy = uvm.LastUpdatedBy;
                usr.Status = uvm.Status;
                usr.RowVer= uvm.RowVer+1;
                    //uvm.Password = GlobalUTIL.Encrypt(string.IsNullOrWhiteSpace(uvm.Password) ? uvm.Password : System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(("" + uvm.Password).Trim())), true, BlazorConstant.SECKEY);
                    await _userPageService.UpdateUser(usr);
                    blazorApiResponse.data = usr;                
                //usr.de = uvm.status;
                // blazorApiResponse.data = uvm;
                blazorApiResponse.message = string.Format("User {0} has been saved", ("" + uvm.LastName + " " + uvm.FirstName));
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
        [HttpPost]
        [Route("adupdateorg")]
        public async Task<ActionResult> UpdateOrg([FromBody] OrganizationViewModel dvm)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                if (dvm != null && dvm.Id <= 0)
                {
                    dvm.CreatedAt = GlobalUTIL.CurrentDateTime;
                    dvm.CreatedBy = (dvm.LastUpdatedBy==null || dvm.LastUpdatedBy==0)?GlobalBasicConfigurationsViewModel.DefaultPublicUserId: dvm.LastUpdatedBy;
                    dvm.LastUpdatedBy = (dvm.LastUpdatedBy == null || dvm.LastUpdatedBy == 0) ? GlobalBasicConfigurationsViewModel.DefaultPublicUserId : dvm.LastUpdatedBy;
                    dvm.RowVer = 1;
                    dvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    //dvm.LastUpdatedBy = dvm.LastUpdatedBy;
                    OrganizationViewModel urg = await _orgPageService.Create(dvm);
                    if (urg != null && urg.Status == 1)
                    {
                       await _utilPageService.sendOrgRegistrationEmailNotfification(urg.Id, ""+urg.Email, ""+urg.Name);
                    }
                        blazorApiResponse.data = urg;

                }
                else
                {
                    dvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    dvm.LastUpdatedBy = dvm.CreatedBy = (dvm.LastUpdatedBy == null || dvm.LastUpdatedBy == 0) ? GlobalBasicConfigurationsViewModel.DefaultPublicUserId : dvm.LastUpdatedBy;  
                    await _orgPageService.Update(dvm);
                    blazorApiResponse.data = dvm;
                }
                blazorApiResponse.message = string.Format("User {0} has been saved", ("" + dvm.Name).Length <= 0 ? dvm.Name : dvm.Name + "" + dvm.Name);
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
        [HttpPost]
        [Route("orgstatusupdate")]
        public async Task<ActionResult> UpdateOrgStatus([FromBody] OrganizationViewModel dvm)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
               
                    var dbModel = await _orgPageService.GetOrgById(dvm.Id);
                    dbModel.Status = dvm.Status;
                    dbModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    dbModel.LastUpdatedBy = dvm.LastUpdatedBy;                   
                   
                    await _orgPageService.Update(dbModel);
                    blazorApiResponse.data = dvm;
               
                blazorApiResponse.message = string.Format("Organization {0} has been update", ("" + dvm.Name).Length <= 0 ? dvm.Name : dvm.Name + "" + dvm.Name);
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
        [HttpPost]
        [Route("dashboard")]
        public async Task<ActionResult>  GetDashboardData([FromBody] DashboardViewModel dbvm)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {

                var data = await _blazorRepoPageService.GetDashboardData(dbvm);
                
                blazorApiResponse.data = data;

                blazorApiResponse.message = string.Format("Dashboard data fetched successfully", data?.Count());
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
        [Route("uploadattachments")]
        [RequestSizeLimit(209715200)]
        [RequestFormLimits(MultipartBodyLengthLimit = 209715200)]
        [Consumes("multipart/form-data")]
        public async Task<BlazorApiResponse> addImages([FromForm] MediacontentModel mcbm)
        {
            BlazorApiResponse response = new BlazorApiResponse();
          //  if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" };
            try
            {
                Int64 productId = Convert.ToInt64(mcbm.id);
                // var files = Request.Form.Files;          
                List<MediacontentViewModel> vFiles = new List<MediacontentViewModel>();
                string applicationPath = _hostingEnvironment.ContentRootPath;
                string fileAbsolutePath = string.Empty;
                int fileCounter = 0;
                if ( HttpContext.Request.Form != null)
                {
                    if (HttpContext.Request.Form.Files.Count() > 0)
                    {
                        byte[] buffer = new byte[16 * 1024];
                        //  string id = files.get;
                        foreach (IFormFile file in Request.Form.Files)
                        {
                            fileCounter++;                        
                            string filename = Guid.NewGuid().ToString() + "_" + Path.GetExtension(file.FileName);                            
                            fileAbsolutePath = applicationPath + BlazorConstant.UPLOAD_WEB_ROOT_UPLOADFOLDER + filename;
                            using (Stream readStream = file.OpenReadStream())
                            {
                                using (FileStream f = new FileStream(fileAbsolutePath, FileMode.Create))
                                {
                                    int readBytes;
                                    while ((readBytes = readStream.Read(buffer, 0, buffer.Length)) > 0)
                                    {
                                        await f.WriteAsync(buffer, 0, readBytes);
                                    }
                                    f.Flush();
                                    f.Close();
                                }
                                vFiles.Add(new MediacontentViewModel { Id = mcbm.id, CompaignId = mcbm.CompaignId,  Name = BlazorConstant.UPLOAD_WEB_ROOT_UPLOADFOLDER + filename, RowVer=1,Remarks = filename, MimeType = Path.GetExtension(file.FileName), CreatedAt = GlobalUTIL.CurrentDateTime, CreatedBy = mcbm.CreatedBy,LastUpdatedAt = GlobalUTIL.CurrentDateTime, LastUpdatedBy = mcbm.CreatedBy });
                            }
                        }
                    }
                    if (vFiles.Any())
                    {
                       var contentFileUploads= await  _mediaContentPageService.addorupdateBulkData(vFiles);
                       response.data = contentFileUploads;
                    }
                    response.message = string.Format(BlazorConstant.INSERTED_SUCCESS, (vFiles.Any() ? vFiles.Count : 0), System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss"));
                }
  
                response.status = true;
            }
            catch (Exception ex)
            {
                response.status = false;
                response.message = ex.Message;
            }
            return response;
        }
      
        [AllowAnonymous]
        [HttpPost("uploadAttachment")]
        [Route("uploadAttachment")]
        [RequestSizeLimit(209715200)]
        [RequestFormLimits(MultipartBodyLengthLimit = 209715200)]
        [Consumes("multipart/form-data")]
        public async Task<BlazorApiResponse> uploadAttachment([FromForm] MediacontentModel mcbm)
        {
            BlazorApiResponse response = new BlazorApiResponse();
            //if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" };
            try
            {                       
                List<MediacontentViewModel> vFiles = new List<MediacontentViewModel>();
                string applicationPath = _hostingEnvironment.ContentRootPath;
                string fileAbsolutePath = string.Empty;
                int fileCounter = 0;
                if (mcbm!= null && HttpContext.Request.Form != null)
                {
                    if (HttpContext.Request.Form.Files.Count() > 0)
                    {
                        byte[] buffer = new byte[16 * 1024];
                        //  string id = files.get;
                        foreach (IFormFile file in Request.Form.Files)
                        {
                            fileCounter++;
                            string filename = Guid.NewGuid().ToString() + "_" + Path.GetExtension(file.FileName);
                            fileAbsolutePath = applicationPath + BlazorConstant.UPLOAD_WEB_ROOT_UPLOADFOLDER + filename;
                            using (Stream readStream = file.OpenReadStream())
                            {
                                using (FileStream f = new FileStream(fileAbsolutePath, FileMode.Create))
                                {
                                    int readBytes;
                                    while ((readBytes = readStream.Read(buffer, 0, buffer.Length)) > 0)
                                    {
                                        await f.WriteAsync(buffer, 0, readBytes);
                                    }
                                    f.Flush();
                                    f.Close();
                                }
                                vFiles.Add(new MediacontentViewModel { Id = mcbm.id,  Name = BlazorConstant.UPLOAD_WEB_ROOT_UPLOADFOLDER + filename, Remarks = filename, MimeType = Path.GetExtension(file.FileName), LastUpdatedAt = GlobalUTIL.CurrentDateTime, LastUpdatedBy = mcbm.CreatedBy });
                            }
                        }
                    }
                    if (vFiles.Any())
                    {
                       // var contentFileUploads = await _mediaContentPageService.addorupdateBulkData(vFiles);
                        response.data = vFiles.FirstOrDefault().Name;
                        response.keyValue = vFiles.FirstOrDefault().Name;
                        response.updateTime = GlobalUTIL.CurrentDateTime;
                    }
                    response.message = string.Format(BlazorConstant.UPLOAD_SUCCESS, (vFiles.Any() ? vFiles.Count : 0), System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss"));
                }

                response.status = true;
            }
            catch (Exception ex)
            {
                response.status = false;
                response.message = ex.Message;
            }
            return response;
        }

        [AllowAnonymous]
        [HttpPost("forgot")]     
        [Route("forgot")]
        public async Task<ActionResult> forgotPassword([FromBody] UserViewModel uvm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
     
            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();          
            try
            {
                var previousRequest = _cache.Get(uvm.Email + Request.Path);
                if (previousRequest == null)
                {
                    blazorApiResponse= await _userPageService.forgotPassword(uvm.Email, uvm.SecurityToken, uvm.Password);                   
                    _cache.Set(uvm.Email + Request.Path, blazorApiResponse.data, System.DateTime.Now.AddSeconds(5));
                }
                else
                {
                    blazorApiResponse.status = true;
                    //  blazorApiResponse.effectedRows = blazorApiResponse.data.Count;
                //    blazorApiResponse.errorCode = "407";
                    blazorApiResponse.data = previousRequest;
                    blazorApiResponse.message = "Load users from cache";
                    blazorApiResponse.message = string.Format("Too many requests, must be {0} Seconds interval between next request!", BlazorConstant.REQUEST_INTERVAL_EMAIL_SECONDS);
                }
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
               // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return Ok(blazorApiResponse);
            // .ToArray();
        }
     
        [HttpPost("changepassword")]
        [Route("changepassword")]
        public async Task<ActionResult> changePassword([FromBody] UserViewModel uvm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });

            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {
                var previousRequest = _cache.Get(uvm.Email + Request.Path);
                if (previousRequest == null)
                {
                    blazorApiResponse = await _userPageService.changePassword(uvm.Id, uvm.Password);
                    _cache.Set(uvm.Email + Request.Path, blazorApiResponse.data, System.DateTime.Now.AddSeconds(5));
                }
                else
                {
                    blazorApiResponse.status = true;
                    //  blazorApiResponse.effectedRows = blazorApiResponse.data.Count;
                    //    blazorApiResponse.errorCode = "407";
                    blazorApiResponse.data = previousRequest;
                    blazorApiResponse.message = "Load users from cache";
                    blazorApiResponse.message = string.Format("Too many requests, must be {0} Seconds interval between next request!", BlazorConstant.REQUEST_INTERVAL_EMAIL_SECONDS);
                }
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return Ok(blazorApiResponse);
            // .ToArray();
        }
    }

}


