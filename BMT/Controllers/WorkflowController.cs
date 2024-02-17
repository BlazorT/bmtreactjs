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
using Blazor.Web.Application.Interfaces;
using com.blazor.bmt.ui.services;
using com.blazor.bmt.core;

namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class WorkflowController : ControllerBase
    { //Almas 
        private IMemoryCache _cache;
        private readonly ILogger<LogController> _logger;       
        private readonly IBlazorRepoPageService _blazorRepoPageService;
        private readonly IDspTablesService _dspTablesService;
        private readonly IWorkflowPageService _workflowPageService;
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        // string applicationPath = string.Empty;
        #region "Constructor and initialization"
        public WorkflowController(Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IDspTablesService dspTablesService, IWorkflowPageService workflowPageService,  IBlazorRepoPageService blazorRepoPageService, IHttpContextAccessor httpContextAccessor, ILogger<LogController> logger,  IMemoryCache cache)
        {
            _logger = logger;         
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _workflowPageService = workflowPageService ?? throw new ArgumentNullException(nameof(workflowPageService));
            _dspTablesService = dspTablesService ?? throw new ArgumentNullException(nameof(dspTablesService));

            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            // applicationPath = _hostingEnvironment.ContentRootPath;
            _logger.LogInformation("Web Api Service Started  at - " + System.DateTime.Now.ToLongTimeString());
        }
        #endregion
        #region "Gets"   

        [HttpPost("workflowtasks")]
        [HttpGet("workflowtasks")]
        [Route("workflowtasks")]
        public async Task<ActionResult> GetWorkflowTasks([FromBody] WorkflowtaskViewModel vm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
                      
            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                        response.data= await _workflowPageService.GetWorkflowTasksAllAsync(vm);                   
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
        [HttpPost("dspstables")]
        [HttpGet("dspstables")]
        [Route("dspstables")]
        public async Task<ActionResult> GetDspSchema([FromBody] DspstableModel dm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });

            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                response.data = await _dspTablesService.GetDspTablesAllFiltersAsync(dm);
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

        [HttpPost("workflowfields")]
        [HttpGet("workflowfields")]
        [Route("workflowfields")]
        public async Task<ActionResult> GetWorkflowFields([FromBody] WffieldViewModel vm)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != BlazorConstant.API_AUTH_KEY)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });

            //  plist.Add(sdtl);
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                response.data = await _workflowPageService.GetWorkflowTaskFieldsAllAsync(vm);
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
        #region "submit actions"        
        //[HttpGet("submitinventory")]
        [HttpPost("submittask")]
        [Route("submittask")]
        public async Task<ActionResult> submitWFTask([FromBody] WorkflowtaskViewModel vm)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                if (vm != null )
                {
                    if (vm.Id > 0)
                    {
                        WorkflowtaskModel vmdb = await _workflowPageService.GetWorkflowTasksById(vm.Id);
                        vm.CreatedAt = vmdb.CreatedAt;
                        vm.CreatedBy = Convert.ToInt32(vmdb.CreatedBy);
                        vm.RowVer = vmdb.RowVer + 1;
                        vm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                        //vm.LastModifiedOn = GlobalUTIL.CurrentDateTime;
                        await _workflowPageService.Update(vm);
                    }
                    else
                    {
                        vm.CreatedAt = GlobalUTIL.CurrentDateTime;
                        vm.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                        vm.RowVer = 1;
                        blazorApiResponse.data = await _workflowPageService.Create(vm);
                    }
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.UPDATED_SUCCESS, vm.Name, GlobalUTIL.CurrentDateTime);
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
        [HttpPost("submittaskwithfields")]
        [Route("submittaskwithfields")]
        public async Task<ActionResult> SubmitTaskWithTaskFields([FromBody] WorkflowtaskViewModel task)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                if (task != null && task.taskfields != null && task.taskfields.Any())
                {
                    blazorApiResponse.data = await _workflowPageService.TaskWithBulkAddorUpdates(task);
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.UPDATED_SUCCESS, task.Name, GlobalUTIL.CurrentDateTime);
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
        [HttpPost("submitfields")]
        [Route("submitfields")]
        public async Task<ActionResult> SubmitFieldsOnly([FromBody] List<WffieldViewModel> ls)
        {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            try
            {
                if (ls != null && ls.Any())
                {
                    blazorApiResponse.data = await _workflowPageService.WorkflowTaskFieldBulkAddorUpdates(ls);
                    blazorApiResponse.status = true;
                    blazorApiResponse.message = string.Format(BlazorConstant.UPDATED_SUCCESS, ls.Count().ToString(), GlobalUTIL.CurrentDateTime);
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


