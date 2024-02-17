using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.ui.services;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;

namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class VehiclesController : ControllerBase
    { //Almas 
        private IMemoryCache _cache;
        private readonly ILogger<VehiclesController> _logger;
        //private readonly IDspPageService _dspPageService;
        private readonly IVehiclesPageService _vehiclesPageService;
        private readonly IInspectionReportPageService _inspectionReportPageService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
       // string applicationPath = string.Empty;
        #region "Constructor and initialization"
        public VehiclesController(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IInspectionReportPageService inspectionReportPageService, IBlazorRepoPageService blazorRepoPageService, IVehiclesPageService vehiclesPageService,   ILogger<VehiclesController> logger,  IMemoryCache cache)
        {
            _logger = logger;
            // _Configuration = configuration;
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _vehiclesPageService = vehiclesPageService ?? throw new ArgumentNullException(nameof(vehiclesPageService));
            _inspectionReportPageService = inspectionReportPageService ?? throw new ArgumentNullException(nameof(inspectionReportPageService));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
           // applicationPath = _hostingEnvironment.ContentRootPath;
            _logger.LogInformation("Web Api Service Started  at - " + System.DateTime.Now.ToLongTimeString());
        }
#endregion
        #region "Vehicles GETS"

        //[Authorize]
        [HttpGet("vehicles")]
        [HttpPost("vehicles")]
        [Route("vehicles")]
        public async Task<ActionResult> loadVehicles([FromBody] WebApiFilters filter)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                var previousRequest = _cache.Get(this.User.Identity.Name + filter.dspid + Request.Path);
                if (previousRequest == null)
                {
                    //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
                    blazorApiResponse.status = true;
                    blazorApiResponse.data = await _vehiclesPageService.GetVehiclesByDSPAndStatusAsnc(Convert.ToInt32(filter.dspid), Convert.ToInt32(filter.status));
                    _cache.Set(this.User.Identity.Name + filter.dspid + Request.Path, blazorApiResponse.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SHORT_INTERVAL));
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
        [HttpGet("vehicleinspectons")]
        [HttpPost("vehicleinspectons")]
        [Route("vehicleinspectons")]
        public async Task<ActionResult> loadVehicleInspectionReports([FromBody] InspectionreportViewModel model)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                var previousRequest = _cache.Get(this.User.Identity.Name + model.Id + Request.Path);
                if (previousRequest == null)
                {
                    //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
                    model.CreatedAt = Convert.ToDateTime(model.CreatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddMonths(-1) : model.CreatedAt;
                    model.LastUpdatedAt = Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime: model.LastUpdatedAt;
                    blazorApiResponse.status = true;
                    blazorApiResponse.data = await _inspectionReportPageService.GetVehicleInspectionReportsAllFiltersAsync(model);
                    _cache.Set(this.User.Identity.Name + model.Id + Request.Path, blazorApiResponse.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SHORT_INTERVAL));
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
        [HttpGet("inspectionswithitems")]
        [HttpPost("inspectionswithitems")]
        [Route("inspectionswithitems")]
        public async Task<ActionResult> loadVehicleInspectionsWithItems([FromBody] InspectionreportViewModel model)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                var previousRequest = _cache.Get(this.User.Identity.Name + model.Id + Request.Path);
                if (previousRequest == null)
                {
                   // model.Id = 35;
                    //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
                    model.CreatedAt = Convert.ToDateTime(model.CreatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddMonths(-1) : model.CreatedAt;
                    model.LastUpdatedAt = Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime : model.LastUpdatedAt;
                    blazorApiResponse.status = true;

                    if(model.Id > 0 )
                        blazorApiResponse.data = await _inspectionReportPageService.GetVehicleInspectionReportById(model.Id);
                    else
                      blazorApiResponse.data = await _blazorRepoPageService.GetVehicleInspectionsData(model);
                    _cache.Set(this.User.Identity.Name + model.Id + Request.Path, blazorApiResponse.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SHORT_INTERVAL));
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
       

        [HttpGet("vehiclesdata")]
        [HttpPost("vehiclesdata")]
        [Route("vehiclesdata")]
        public async Task<ActionResult> loadVehiclesData([FromBody] VehicleViewModel vm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                var previousRequest = _cache.Get(this.User.Identity.Name + vm.Id + Request.Path);
                if (previousRequest == null)
                {
                    //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
                    blazorApiResponse.status = true;
                    blazorApiResponse.data = await _blazorRepoPageService.GetVehicleDetailedData(vm);
                    _cache.Set(this.User.Identity.Name + vm.Id + Request.Path, blazorApiResponse.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SHORT_INTERVAL));
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
        #region "Submit Vehicles"
        //[HttpGet("submitvehicle")]
        [HttpPost("submitvehicle")]
        [Route("submitvehicle")]
        public async Task<ActionResult> submitFleetVehicle([FromBody] VehicleViewModel vm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                if (vm != null && vm.Id <= 0)
                {
                    vm.CreatedAt = GlobalUTIL.CurrentDateTime;
                    vm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    vm.LastUpdatedBy = vm.LastUpdatedBy;
                    vm.CreatedBy = vm.CreatedBy;
                    vm.Status = vm.Status;
                    blazorApiResponse.data = await _vehiclesPageService.Create(vm);
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.INSERTED_SUCCESS, vm.Name, GlobalUTIL.CurrentDateTime);

                }
                else if (vm != null && vm.Id > 0) {
                   VehicleViewModel vdbml= await _vehiclesPageService.GetVehicleById(vm.Id);
                    vm.CreatedAt = vdbml.CreatedAt;
                    vm.CreatedBy = vdbml.CreatedBy;
                    vm.RowVer = vdbml.RowVer + 1;
                    vm.HelperDriverId = vdbml.HelperDriverId;
                    vm.AssignedDaid = vdbml.AssignedDaid;
                    vm.ViolationsCount = vdbml.ViolationsCount;                   
                    // vm.CreatedAt = GlobalUTIL.CurrentDateTime;
                    vm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    vm.LastUpdatedBy = vm.LastUpdatedBy;
                    //vm.CreatedBy = vm.CreatedBy;
                    vm.Status = vm.Status;
                     await _vehiclesPageService.Update(vm);
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.UPDATED_SUCCESS, vm.Name, GlobalUTIL.CurrentDateTime);
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
        [HttpGet("submitvehicleinspection")]
        [HttpPost("submitvehicleinspection")]
        [Route("submitvehicleinspection")]
        public async Task<ActionResult> submitVehicleInspection([FromBody] InspectionreportViewModel vm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                if (vm != null && vm.Id <= 0)
                {
                    vm.CreatedAt = GlobalUTIL.CurrentDateTime;
                    vm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    vm.LastUpdatedBy = vm.LastUpdatedBy;
                    vm.CreatedBy = vm.CreatedBy;
                    vm.Status = vm.Status;
                    blazorApiResponse.data = await _inspectionReportPageService.Create(vm);
                    if (vm.inspectionItems != null && vm.inspectionItems.Any()) {
                       
                    }
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.INSERTED_SUCCESS, vm.VehicleId, GlobalUTIL.CurrentDateTime);

                }
                else if (vm != null && vm.Id > 0)
                {
                    InspectionreportViewModel vdbml = await _inspectionReportPageService.GetVehicleInspectionReportById(vm.Id);
                    vm.CreatedAt = vdbml.CreatedAt;
                    vm.CreatedBy = vdbml.CreatedBy;
                   // vm.RowVer = vdbml.RowVer + 1;                   
                    // vm.CreatedAt = GlobalUTIL.CurrentDateTime;
                    vm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    vm.LastUpdatedBy = vm.LastUpdatedBy;
                    //vm.CreatedBy = vm.CreatedBy;
                    vm.Status = vm.Status;
                    await _inspectionReportPageService.Update(vm);
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.UPDATED_SUCCESS, vm.VehicleId, GlobalUTIL.CurrentDateTime);
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
        [HttpGet("submitinspectionreportwithitems")]
        [HttpPost("submitinspectionreportwithitems")]
        [Route("submitinspectionreportwithitems")]
        public async Task<ActionResult> submitInspectionReportWithItems([FromBody] InspectionreportViewModel vm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                if (vm != null && vm.Id <= 0)
                {
                    vm.CreatedAt = GlobalUTIL.CurrentDateTime;
                    vm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    vm.LastUpdatedBy = vm.LastUpdatedBy;
                    vm.CreatedBy = vm.CreatedBy;
                    vm.Status = vm.Status;
                    blazorApiResponse.data = await _inspectionReportPageService.CreateInspectionReportWithItems(vm);                  
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.INSERTED_SUCCESS, vm.VehicleId, GlobalUTIL.CurrentDateTime);

                }
                else if (vm != null && vm.Id > 0)
                {
                    InspectionreportViewModel vdbml = await _inspectionReportPageService.GetVehicleInspectionReportById(vm.Id);
                    vm.CreatedAt = vdbml.CreatedAt;
                    vm.CreatedBy = vdbml.CreatedBy;
                    // vm.RowVer = vdbml.RowVer + 1;                   
                    // vm.CreatedAt = GlobalUTIL.CurrentDateTime;
                    vm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    vm.LastUpdatedBy = vm.LastUpdatedBy;
                    //vm.CreatedBy = vm.CreatedBy;
                    vm.Status = vm.Status;
                    await _inspectionReportPageService.UpdateInspectionReportWithItems(vm);
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.UPDATED_SUCCESS, vm.VehicleId, GlobalUTIL.CurrentDateTime);
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


