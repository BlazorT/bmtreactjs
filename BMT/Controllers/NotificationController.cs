using Blazor.Web.UI.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class NotificationsController : ControllerBase
    {            
        private readonly INotificationPageService _notificationPageService;
             
        private readonly IMemoryCache _cache;
        public NotificationsController(INotificationPageService notificationPageService,   IMemoryCache cache)
        {
            _notificationPageService = notificationPageService ?? throw new ArgumentNullException(nameof(notificationPageService));
           
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));           
          //  _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor)); 
        }
       // **************************** Users - Students ***************************************************//
        [HttpPost("addupdatenotifications")]
        [HttpGet("addupdatenotifications")]
        [Route("addupdatenotifications")]
        public async Task<ActionResult> AddUpdateNotifications([FromBody] List<NotificationViewModel> nlst)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != GlobalBasicConfigurationsViewModel.ApiAuthKey)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });      
            BlazorApiResponse response = new BlazorApiResponse();           
                try
                {
            
                    // GET DATA
                     response.data = await _notificationPageService.AddUpdateNofications(nlst); 
                   // response.data = await _blazorRepoPageService.loadRoleMenus(Convert.ToInt32(filter.roleId));
                    response.status = true;
                }
                catch (Exception ex)
                {
                    response.message = ex.Message;
                    response.status = false;
                }

           
            return Ok(response);
           
        }
       
        [HttpPost("mynotifications")]
        [HttpGet("mynotifications")]
        [Route("mynotifications")]
        public async Task<ActionResult> GetCandidateNotifications([FromBody] NotificationViewModel model)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != GlobalBasicConfigurationsViewModel.ApiAuthKey)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
               
                response.data =  await _notificationPageService.GetNotificationDetails(model);              
                response.status = true;
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
                response.status = false;
            }
            return Ok(response);
        }
       
      

    }
}