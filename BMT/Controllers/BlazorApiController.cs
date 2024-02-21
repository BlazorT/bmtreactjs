using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.infrastructure;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.application.model;
using Microsoft.AspNetCore.Authorization;
using MySql.Data.MySqlClient;
using Blazor.Web.UI.Interfaces;

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
       // private readonly IProductPageService _productPageService;
        private readonly IMediaContentPageService _mediaContentPageService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;
        private readonly IAppLogPageService _appLogPageService;
        private readonly IUsersPageService _userPageService;
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        string applicationPath = string.Empty;
        private _bmtContext? dbContext;
        public BlazorApiController(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IMediaContentPageService mediaContentPageService, IAppLogPageService appLogPageService, IBlazorRepoPageService blazorRepoPageService, IOrgPageService orgPageService, IUsersPageService userPageService,  ILogger<BlazorApiController> logger,  IMemoryCache cache)
        {
            _logger = logger;
            // _Configuration = configuration; 
            this.dbContext = new _bmtContext();
            _cache = cache;
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
        [HttpGet]
        [HttpPost]
        [Route("das")]
        public async Task<ActionResult> GetDAUsers()
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
           // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
               // blazorApiResponse.data = await _userPageService.GetUsersListAsync(0, 1);
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
        [HttpGet("useranddausers")]
        [HttpPost("useranddausers")]
        [Route("useranddausers")]
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
        [Route("updateda")]
        public async Task<ActionResult> UpdateDAUser([FromBody] UserViewModel uvm)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            // List<User> cstrs = new List<User>();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                if (uvm != null && uvm.Id <= 0)
                {
                    uvm.CreatedAt = GlobalUTIL.CurrentDateTime;
                    uvm.CreatedBy = uvm.LastUpdatedBy;
                    //uvm.VerificationMethod = uvm.VerificationMethod==null?0: uvm.VerificationMethod;            
                    //uvm.HasValidDrivingLicense = uvm.HasValidDrivingLicense == null ? 0 : uvm.HasValidDrivingLicense;
                    uvm.RegistrationSource = uvm.RegistrationSource==null?0: uvm.RegistrationSource;
                    uvm.RowVer = 1;
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
                   // uvm.HasValidDrivingLicense = uvm.HasValidDrivingLicense == null? usr.HasValidDrivingLicense: uvm.HasValidDrivingLicense;
                    uvm.RegistrationSource = usr.RegistrationSource;
                    //uvm.CreatedBy = usr.CreatedBy;
                    uvm.RowVer = usr.RowVer + 1;
                   // uvm.Password=  GlobalUTIL.Encrypt(string.IsNullOrWhiteSpace(uvm.Password) ? uvm.Password:System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String((""+uvm.Password).Trim())), true, BlazorConstant.SECKEY);
                    await _userPageService.CreateUser(uvm);
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
                    dvm.CreatedBy = dvm.LastUpdatedBy;
                    dvm.RowVer = 1;
                    dvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    dvm.LastUpdatedBy = dvm.LastUpdatedBy;
                    blazorApiResponse.data = await _orgPageService.Create(dvm);
                }
                else
                {
                    dvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    dvm.LastUpdatedBy = dvm.LastUpdatedBy;
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
        [Route("uploadattachments")]
        [RequestSizeLimit(209715200)]
        [RequestFormLimits(MultipartBodyLengthLimit = 209715200)]
        [Consumes("multipart/form-data")]
        public async Task<BlazorApiResponse> addImages([FromForm] MediacontentModel mcbm)
        {
            BlazorApiResponse response = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" };
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
        [HttpPost]
        [Route("uploadattachment")]
        [RequestSizeLimit(209715200)]
        [RequestFormLimits(MultipartBodyLengthLimit = 209715200)]
        [Consumes("multipart/form-data")]
        public async Task<BlazorApiResponse> uploadAttachment([FromForm] MediacontentModel mcbm)
        {
            BlazorApiResponse response = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" };
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
                    blazorApiResponse= await _userPageService.forgotPassword(uvm.Email, "", uvm.Password);                   
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


