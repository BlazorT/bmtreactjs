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
using Microsoft.AspNetCore.Cors;
using com.blazor.bmt.ui.services;
using Microsoft.AspNetCore.Authentication;
using MySql.Data.MySqlClient;
using System.Text.Json;
using com.blazor.bmt.core;
using com.blazor.bmt.infrastructure;

namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class InventoryController : ControllerBase
    { //Almas 
        private IMemoryCache _cache;
        private readonly ILogger<InventoryController> _logger;
        private readonly IAppLogPageService _appLogPageService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;
        private readonly IInventoryDetailPageService _inventoryDetailPageService;  
        
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        // string applicationPath = string.Empty;
        #region "Constructor and initialization"
        public InventoryController(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IInventoryDetailPageService inventoryDetailPageService, IBlazorRepoPageService blazorRepoPageService, IAppLogPageService appLogPageService,  IHttpContextAccessor httpContextAccessor, ILogger<InventoryController> logger,  IMemoryCache cache)
        {
            _logger = logger;  
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _inventoryDetailPageService = inventoryDetailPageService ?? throw new ArgumentNullException(nameof(inventoryDetailPageService));
            _appLogPageService = appLogPageService ?? throw new ArgumentNullException(nameof(appLogPageService));           
            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            // applicationPath = _hostingEnvironment.ContentRootPath;
            _logger.LogInformation("InventoryController Service Started  at - " + GlobalUTIL.CurrentDateTime.ToLongTimeString());
        }
        #endregion
        #region "Inventory Data"
       
       
        [HttpPost("inventorydetails")]
        [HttpGet("inventorydetails")]
        [Route("inventorydetails")]
        public async Task<ActionResult> GetinventorydetailData([FromBody] WebApiFilters model)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });          
            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                response.data = await _inventoryDetailPageService.GetInventoryDetailsByDspAndStatusAsnc(Convert.ToInt32(model.dspid), Convert.ToInt32(model.status));
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

        [HttpPost("dispatchments")]
        [HttpGet("dispatchments")]
        [Route("dispatchments")]
        public async Task<ActionResult> GetInventoryDispatchmentData([FromBody] DispatchmentViewModel model)
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
        [HttpPost("inventoryfulldetails")]
        [HttpGet("inventoryfulldetails")]
        [Route("inventoryfulldetails")]
        public async Task<ActionResult> GetinventoryFullDetailData([FromBody] Inventorydetailviewmodel model)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                response.data = await _blazorRepoPageService.GetInventoryDetailedDataData(model);
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
        //[HttpGet("submitinventory")]
        [HttpPost("submitinventory")]
        [Route("submitinventory")]
        public async Task<ActionResult> submitInvenotryData([FromBody] List<Inventorydetailviewmodel> lsvm )
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {               
                    if (lsvm != null && lsvm.Any())
                    {                      
                        blazorApiResponse.data = await _inventoryDetailPageService.addorupdateInventoryDetails(lsvm);
                        blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.UPDATED_SUCCESS, lsvm.Count.ToString(), GlobalUTIL.CurrentDateTime);
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
        
        #endregion

    }

}


