using System.Data;
using Microsoft.AspNetCore.Mvc;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.ui.interfaces;


namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class DispatchmentController : ControllerBase
    { //Almas 
        private readonly IDispatchmentPageService _dispatchmentPageService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;
        private readonly ILogger<DispatchmentController> _logger;
        private readonly IAppLogPageService _appLogPageService;
      
        // string applicationPath = string.Empty;
        #region "Constructor and initialization"
        public DispatchmentController(IDispatchmentPageService dispatchmentPageService, IBlazorRepoPageService blazorRepoPageService, IAppLogPageService appLogPageService,   ILogger<DispatchmentController> logger)
        {
            _logger = logger;
            //  _cache = cache ?? throw new ArgumentNullException(nameof(cache));
             _dispatchmentPageService = dispatchmentPageService ?? throw new ArgumentNullException(nameof(dispatchmentPageService));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _appLogPageService = appLogPageService ?? throw new ArgumentNullException(nameof(appLogPageService));          
          
            // applicationPath = _hostingEnvironment.ContentRootPath;
            _logger.LogInformation("DispatchmentController service started  at - " + GlobalUTIL.CurrentDateTime.ToLongTimeString());
        }
        #endregion
        #region "Dispatchment Data"  

        [HttpPost("dispatchments")]
        [HttpGet("dispatchments")]
        [Route("dispatchments")]
        public async Task<ActionResult> GetDispatchmentsData([FromBody] DispatchmentViewModel model)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                response.data = await _blazorRepoPageService.GetDispatchmentofProductsAndVehiclesData(model);
                response.status = true;
                //  _cache.Set(model.dspid + this.User.Identity.Name + Request.Path + model.roleId, response.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SHORT_INTERVAL));                
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
        [HttpPost("hybriddispatchments")]
        [HttpGet("hybriddispatchments")]
        [Route("hybriddispatchments")]
        public async Task<ActionResult> GetDispatchmenUpdatedtData([FromBody] DispatchmentViewModel model)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                response.data = await _dispatchmentPageService.GetDispatchmentsAllAsync(model);
                response.status = true;
                //  _cache.Set(model.dspid + this.User.Identity.Name + Request.Path + model.roleId, response.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SHORT_INTERVAL));                
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

        [HttpPost("submitdispatchments")]
        [Route("submitdispatchments")]
        public async Task<ActionResult> updateDispatchmentsData([FromBody] List<DispatchmentCustomViewMode> dlst)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                if (dlst != null && dlst.Any())
                {
                    blazorApiResponse.data = await _blazorRepoPageService.updateDispatchments(dlst);
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.UPDATED_SUCCESS, dlst.Count.ToString(), GlobalUTIL.CurrentDateTime);
                    // blazorApiResponse.message = string.Format(BlazorConstant.INSERTED_SUCCESS, uvm.LastName, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));
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


        [HttpPost("submitdadispatchments")]
        [Route("submitdadispatchments")]
        public async Task<ActionResult> updateDADispatchmentsData([FromBody] List<DispatchmentViewModel> dlst)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                if (dlst != null && dlst.Any())
                {
                    blazorApiResponse.data = await _blazorRepoPageService.UpdateDADispatchments(dlst);
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.UPDATED_SUCCESS, dlst.Count.ToString(), GlobalUTIL.CurrentDateTime);
                    // blazorApiResponse.message = string.Format(BlazorConstant.INSERTED_SUCCESS, uvm.LastName, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));
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


