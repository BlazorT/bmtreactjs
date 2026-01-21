using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;

using Blazor.Web.UI.Interfaces;

namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class LogController : ControllerBase
    { //Almas 
        private IMemoryCache _cache;
        private readonly ILogger<LogController> _logger;
        private readonly IAppLogPageService _appLogPageService;
        private readonly IAppLogService _appLogService;
        private readonly IAuditLogService _auditLogService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;       
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        // string applicationPath = string.Empty;
        #region "Constructor and initialization"
        public LogController(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IAppLogPageService appLogPageService, IAppLogService appLogService,  IAuditLogService auditLogService, IBlazorRepoPageService blazorRepoPageService, IHttpContextAccessor httpContextAccessor, ILogger<LogController> logger,  IMemoryCache cache)
        {
            _logger = logger;         
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _appLogPageService = appLogPageService ?? throw new ArgumentNullException(nameof(appLogPageService));
            _appLogService = appLogService ?? throw new ArgumentNullException(nameof(appLogService));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _auditLogService = auditLogService ?? throw new ArgumentNullException(nameof(auditLogService));
           
            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            // applicationPath = _hostingEnvironment.ContentRootPath;
            _logger.LogInformation("Web Api Service Started  at - " + System.DateTime.Now.ToLongTimeString());
        }
        #endregion
        #region "Logs"        

        [HttpPost("applog")]
        [HttpGet("applog")]
        [Route("applog")]
        public async Task<ActionResult> GetAppLogData([FromBody] AppLogViewModel vm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
                      
            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
              
                    try
                    {
                    // response.data= await _appLogPageService.GetAppLogByUser(vm.UserId);                   
                    response.data = await _appLogPageService.GetAppLogByAllFilters(vm);
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

        [HttpPost("auditlog")]
        [HttpGet("auditlog")]
        [Route("auditlog")]
        public async Task<ActionResult> GeAudittLogData([FromBody] AuditLogModel m)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                response.status = true;
                response.data = await _auditLogService.GetAuditlogDetails(m);
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
        [HttpPost("auditlogdetails")]
        [HttpGet("auditlogdetails")]
        [Route("auditlogdetails")]
        public async Task<ActionResult> GeAudittLogDetailsData([FromBody] AuditLogViewModel m)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                response.status = true;
                response.data = await _blazorRepoPageService.GetAuditLogDetailsData(m);
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
        #region "Common Audit Log Submit"        

        [HttpGet("submitauditlog")]
        [HttpPost("submitauditlog")]
        [Route("submitauditlog")]
        public async Task<ActionResult> subAuditLog([FromBody] AuditLogModel m)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {

             
                    m.CreatedAt = GlobalUTIL.CurrentDateTime;  
                     await _auditLogService.Create(m);
                    blazorApiResponse.data = m;
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

       // [HttpGet("bulkapplog")]
        [HttpPost("bulkapplog")]
        [Route("bulkapplog")]
        public async Task<ActionResult> subBulkAppLog([FromBody] List<ApplogModel> ls)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {

                await _appLogService.InsertUpdateBulk(ls);
                blazorApiResponse.data = null;
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
        #endregion


    }

}


