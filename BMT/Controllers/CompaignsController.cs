﻿using Blazor.Web.UI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.application.model;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.core;

namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class CompaignsController : ControllerBase
    {            
        private readonly IBlazorUtilPageService _utilPageService;
        private readonly ICompaignService _compaignService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;     
        private readonly IMemoryCache _cache;
        public CompaignsController(IBlazorUtilPageService utilPageService, ICompaignService compaignService, IBlazorRepoPageService blazorRepoPageService,  IMemoryCache cache)
        {
             _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _utilPageService = utilPageService ?? throw new ArgumentNullException(nameof(utilPageService));
            _compaignService = compaignService ?? throw new ArgumentNullException(nameof(compaignService));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));           
          //  _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor)); 
        }
       
        public IEnumerable<UserViewModel> dnlist { get; set; } = new List<UserViewModel>();
        // **************************** Users - Students ***************************************************//
        [HttpPost("detailedcompaigns")]
        [HttpGet("detailedcompaigns")]
        [Route("detailedcompaigns")]
        public async Task<ActionResult> GetCompaignDataAll([FromBody] CompaignsViewModel model)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != GlobalBasicConfigurationsViewModel.ApiAuthKey)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });      
            BlazorApiResponse response = new BlazorApiResponse();
           
                try
                {
                    model.CreatedAt = Convert.ToDateTime(model.CreatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddMonths(-2) : model.CreatedAt;  //new DateTime(UTIL.GlobalApp.CurrentDateTime.Year, 1, 1);///;uvm.CreatedAt.Year <= 1900 ? new DateTime(System.DateTime.Now.Year, System.DateTime.Now.Month, 1) : uvm.CreatedAt;
                    model.LastUpdatedAt = Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime : model.LastUpdatedAt;
                    // vm.Status = vm.Status;
                    model.Name = "" + model.Name;
                    // int OrgId = this.User == null ? 0 : Convert.ToInt32(this.User.Claims.Where(x => x.Type == "OrgId").FirstOrDefault().Value);
                    model.OrgId = ((model.OrgId <= 0 || model.OrgId == null) ? 0 : model.OrgId);
                    // var videos = await _blazorRepoPageService.GetBulkVideos(mcvm);
                    // GET DATA
                     response.data = await _blazorRepoPageService.GetCompaignsData(model); ;
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
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task sendInvitationEmail(string email, int roleId = 0, int id = 0)

        {           
            try
            {
                var alreadySent = _cache.Get(email + BlazorConstant.TOKEN_EXTERNAL_DELIMETER + id);
                if (alreadySent == null)
                {
                    //if (Configurations.invitationEmailSubject == null)
                    //    await _utilPageService.loadSettingsAndConfigurations();
                    string token = GlobalUTIL.Encrypt(Convert.ToString(PackageUtil.GenerateRandomNo()) + BlazorConstant.TOKEN_EXTERNAL_DELIMETER + id.ToString(), true, BlazorConstant.SECKEY);
                  
                    // Prepare & Send Email Contents
                    string baseURIToken = string.Empty;
                    var baseUrl = string.Format("{0}://{1}{2}", HttpContext.Request.Scheme, HttpContext.Request.Host, Url.Content("~"));
                    string uri = string.Empty;
                    if (roleId == (int)USERROLES.SUPERVISOR || roleId == (int)USERROLES.STAFF)
                    {
                        uri = baseUrl + "/pages/register?id=" + id + "&roleId=" + roleId + "&token=" + token;
                        baseURIToken = "<a href='" + uri + "'><span><strong>Complete Registration</strong></span> </a>";
                    }
                    else if (roleId == (int)USERROLES.STAFF)
                    {
                        uri = baseUrl + "/pages/RegisterDonor?id=" + id + "&token=" + token;
                        baseURIToken = "<a href='" + uri + "'><span><strong>Complete Registration</strong></span> </a>";
                    }
                    else if (roleId == (int)USERROLES.SUPERVISOR)
                    {
                        uri = baseUrl + "/pages/RegistrationSchool?id=" + id + "&token=" + token;
                        baseURIToken = "<a href='" + uri + "'><span><strong>Complete Registration</strong></span> </a>";
                    }
                    // Send Email
                    await _utilPageService.sendInvitationEmailNotfification(email, baseURIToken, uri, (USERROLES)roleId);
                    MemoryCacheEntryOptions cacheOption = new MemoryCacheEntryOptions()
                    {

                        AbsoluteExpirationRelativeToNow = (DateTime.Now.AddMinutes(BlazorConstant.REQUEST_INTERVAL_SECONDS) - DateTime.Now)
                    };
                    _cache.Set(email + BlazorConstant.TOKEN_EXTERNAL_DELIMETER + id, id.ToString(), cacheOption);
                    //BlazorResponseViewModel.data = "";
                    //BlazorResponseViewModel.message = string.Format(UTIL.BlazorConstants.INVITATION_EMAIL_SENT_SUCCESSFULLY, email, System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss"));
                   
                }//if(alreadySent == null) {                

            }
            catch (Exception ex)
            {
                //BlazorResponseViewModel.message = string.Format(UTIL.BlazorConstants.INVITATION_EMAIL_FAILED, email, (ex.InnerException == null ? ex.Message : ex.InnerException.Message)); ;
                throw ex;
            }
            //return BlazorResponseViewModel;

        }
        [HttpPost("submitcompaign")]
        [HttpGet("submitcompaign")]
        [Route("submitcompaign")]
        public async Task<ActionResult> postCompaignData([FromBody] CompaignsViewModel model)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != GlobalBasicConfigurationsViewModel.ApiAuthKey)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                model.LastUpdatedBy = model.LastUpdatedBy == null ? GlobalBasicConfigurationsViewModel.DefaultPublicUserId : model.LastUpdatedBy;
                model.CreatedBy = model.CreatedBy == null ? GlobalBasicConfigurationsViewModel.DefaultPublicUserId : model.CreatedBy; // model.CreatedBy == null ? UserId : model.CreatedBy;
                response.data = await _blazorRepoPageService.postCompaignData(model, Convert.ToInt32(model.CreatedBy));              
                response.status = true;
            }
            catch (Exception ex)
            {
                response.message = ex.Message;
                response.status = false;
            }
            return Ok(response);
        }
       
        [HttpPost("updatecompaign")]   
        [Route("updatecompaign")]
        public async Task<ActionResult> updateCompaign(CompaignsViewModel model)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]) != GlobalBasicConfigurationsViewModel.ApiAuthKey)) return Ok(new BlazorApiResponse { status = false, errorCode = "201", message = "Authorization Failed" });
            BlazorResponseViewModel response = new BlazorResponseViewModel();
            try
            {                
               CompaignModel cModel = new CompaignModel { Id = model.Id };
                // string token = UTIL.CryptoEngine.Encrypt(Convert.ToString(UTIL.PackageUtil.GenerateRandomNo()) + UTIL.BlazorConstants.TOKEN_EXTERNAL_DELIMETER + id.ToString(), true, UTIL.Configurations.SecKeyCode);
                var ls = await _compaignService.GetCompainListAllFiltersAsync(cModel);
                if (ls.Any())
                {
                    cModel = ls.FirstOrDefault();
                    cModel.Status = model.Status<= 0 ?(int)COMPAIGNS_STATUS.DROPPED: model.Status;
                    cModel.LastUpdatedBy = model.LastUpdatedBy;
                    cModel.LastUpdatedAt = System.DateTime.UtcNow;
                    await _compaignService.Update(cModel);
                    response.data = model;
                    response.status = true;
                    response.message = string.Format(BlazorConstant.UPDATED_SUCCESS, cModel.Name, GlobalUTIL.CurrentDateTime.ToString());
                }
                else {
                    response.message = string.Format(BlazorConstant.UPDATE_FAILED, cModel.Name, "Failed to change status of compaign");
                    response.status = false;
                }
               

            }
            catch (Exception ex)
            {
                response.status = false;
                response.message = string.Format(BlazorConstant.UPDATE_FAILED, model.Name, ex.Message);
                //response.message = ex.Message;
            }
            return Ok(response);

        }

    }
}