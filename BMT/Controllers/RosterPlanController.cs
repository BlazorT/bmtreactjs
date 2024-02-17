using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.ui.interfaces;


namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class RosterPlanController : ControllerBase
    { //Almas 
        private IMemoryCache _cache;
        private readonly ILogger<RosterPlanController> _logger;       
        private readonly IRosterPlanPageService _rosterPlanPageService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        // string applicationPath = string.Empty;
        #region "Constructor and initialization"
        public RosterPlanController(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IRosterPlanPageService rosterPlanPageService,  IBlazorRepoPageService blazorRepoPageService, IHttpContextAccessor httpContextAccessor, ILogger<RosterPlanController> logger,  IMemoryCache cache)
        {
            _logger = logger;         
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _rosterPlanPageService = rosterPlanPageService ?? throw new ArgumentNullException(nameof(rosterPlanPageService));

            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));

            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            // applicationPath = _hostingEnvironment.ContentRootPath;
            _logger.LogInformation("Web Api Service Started  at - " + System.DateTime.Now.ToLongTimeString());
        }
        #endregion

        #region "Get"
        [HttpPost("rosterplan")]
        [HttpGet("rosterplan")]
        [Route("rosterplan")]
        public async Task<ActionResult> GetRosterPlanWithFleet([FromBody] RosterplanViewModel vm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });

            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                 response.data= await _rosterPlanPageService.GetRosterPlanWithFleetPlansByIdSync(vm.Id);                   
               // response.data = await _blazorRepoPageService.GetRosterFleetsData(vm);
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
    
            [HttpPost("rosterfleetplandetails")]
            [HttpGet("rosterfleetplandetails")]
            [Route("rosterfleetplandetails")]
            public async Task<ActionResult> GetRosterPlanWithFleetDetails([FromBody] RosterplanViewModel vm)
            {
                if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
                      
                //  plist.Add(sdtl);
                BlazorApiResponse response = new BlazorApiResponse();
                try
                {
                // response.data= await _rosterPlanPageService.GetRosterPlanWithFleetPlansByIdSync(vm.Id);                   
                response.data = await _blazorRepoPageService.GetRosterFleetsData(vm);
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

            [HttpPost("rosterplans")]
            [HttpGet("rosterplans")]
            [Route("rosterplans")]
            public async Task<ActionResult> GetRosterPlansAllFilters([FromBody] RosterplanViewModel vm)
            {
                if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });

                //  plist.Add(sdtl);
                BlazorApiResponse response = new BlazorApiResponse();
                try
                {
                    response.data = await _rosterPlanPageService.GetRosterPlasAllFiltersAsync(vm);
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
        #endregion
        #region "Submit Roster Plans"

        [HttpPost("submitroster")]
        [Route("submitroster")]
        public async Task<ActionResult> submitrosterData([FromBody] RosterplanViewModel rvm)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                if (rvm != null && rvm.Id <= 0)
                {
                    rvm.CreatedAt = GlobalUTIL.CurrentDateTime;
                    rvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    rvm.RowVer = 1;
                    blazorApiResponse.data = await _rosterPlanPageService.CreateRosterWithFleet(rvm);
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.INSERTED_SUCCESS, rvm.Id.ToString(), GlobalUTIL.CurrentDateTime);
                    // blazorApiResponse.message = string.Format(BlazorConstant.INSERTED_SUCCESS, uvm.LastName, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));
                }
                else {
                    RosterplanViewModel dbModel =await _rosterPlanPageService.GetRosterPlanByIdSync(rvm.Id);
                    rvm.CreatedAt = dbModel.CreatedAt;
                    rvm.CreatedBy = dbModel.CreatedBy;
                    rvm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    rvm.LastUpdatedBy = rvm.LastUpdatedBy;
                    rvm.RowVer = dbModel.RowVer +1;
                    blazorApiResponse.data = await _rosterPlanPageService.UpdateRosterWithFleet(rvm);
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.UPDATED_SUCCESS, rvm.Id.ToString(), GlobalUTIL.CurrentDateTime);
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


