using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Blazor.Web.UI.Interfaces;
using Blazor.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.Caching;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Blazor.Web.Application.Interfaces;
using Blazor.Web.Application.Models;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.application.model;
using com.blazor.bmt.application.interfaces;

namespace com.blazor.bmt.controllers
{
    public class CompaignsController : Controller
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
        public async Task<GridResponseViewModel> GetCompaignDataAll([FromQuery] GridSortAndFilterViewModel filterModel, [FromQuery] CompaignsViewModel model)
        {
            string sortBy = filterModel.sord;// HttpContext.Request.Query["sord"];
            string sortcolumn = filterModel.sidx;  //HttpContext.Request.Query["sidx"];
            int pageNo = filterModel.page;  //Convert.ToInt32(HttpContext.Request.Query["page"]);
            int length = filterModel.rows; // Convert.ToInt32(HttpContext.Request.Query["rows"]);

            // MediaContentViewModel mcvm = new MediaContentViewModel();
            model.CreatedAt = Convert.ToDateTime(model.CreatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddMonths(-2) : model.CreatedAt;  //new DateTime(UTIL.GlobalApp.CurrentDateTime.Year, 1, 1);///;uvm.CreatedAt.Year <= 1900 ? new DateTime(System.DateTime.Now.Year, System.DateTime.Now.Month, 1) : uvm.CreatedAt;
            model.LastUpdatedAt = Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime : model.LastUpdatedAt;
            // vm.Status = vm.Status;
            model.Name = "" + model.Name;
            int OrgId = this.User == null ? 0 : Convert.ToInt32(this.User.Claims.Where(x => x.Type == "OrgId").FirstOrDefault().Value);
            model.OrgId = ((model.OrgId <= 0 || model.OrgId == null) ? OrgId : model.OrgId);
            // var videos = await _blazorRepoPageService.GetBulkVideos(mcvm);
            // GET DATA
            var compaignsLst = await _blazorRepoPageService.GetCompaignsData(model);// (int)UTIL.COMMON_STATUS_ALL.ALL, Convert.ToInt32(uvm.OrgId),(int)UTIL.USERROLES.SUPERVISOR, uvm.CompleteName, uvm.Status, uvm.CreatedAt, Convert.ToDateTime(uvm.LastUpdatedAt));
            // ['sr#', 'Email', 'Name', 'Plans', 'Supervisor','Date of Joining', 'Status', 'Action']
            // if (sortcolumn.Trim() != string.Empty)
            {
                switch (sortcolumn.ToLower())
                {
                    case "name":
                        if (sortBy.ToLower().Contains("desc"))
                            compaignsLst = compaignsLst.OrderByDescending(s => s.Name).ThenByDescending(m => m.Title);
                        else
                            compaignsLst = compaignsLst.OrderBy(s => s.Name).ThenBy(m => m.Title) ;
                        break;                  
                    case "orgName":
                        if (sortBy.ToLower().Contains("desc"))
                            compaignsLst = compaignsLst.OrderByDescending(s => s.OrgName);
                        else
                            compaignsLst = compaignsLst.OrderBy(s => s.OrgName);
                        break;
                    //case "grade":
                    //    if (sortBy.ToLower().Contains("desc"))
                    //        dnlist = dnlist.OrderByDescending(s => s.Grade);
                    //    else
                    //        dnlist = dnlist.OrderBy(s => s.Grade);
                    //    break;
                    //case "gpa":
                    //    if (sortBy.ToLower().Contains("desc"))
                    //        dnlist = dnlist.OrderByDescending(s => s.GPA);
                    //    else
                    //        dnlist = dnlist.OrderBy(s => s.GPA);
                    //    break;
                    case "startTime":
                        if (sortBy.ToLower().Contains("desc"))
                            compaignsLst = compaignsLst.OrderByDescending(s => s.StartTime);
                        else
                            compaignsLst = compaignsLst.OrderBy(s => s.StartTime);
                        break;
                    case "finishTime":
                        if (sortBy.ToLower().Contains("desc"))
                            compaignsLst = compaignsLst.OrderByDescending(s => s.FinishTime);
                        else
                            compaignsLst = compaignsLst.OrderBy(s => s.FinishTime);
                        break;
                    case "networkName":
                        if (sortBy.ToLower().Contains("desc"))
                            compaignsLst = compaignsLst.OrderByDescending(s => s.NetworkName);
                        else
                            compaignsLst = compaignsLst.OrderBy(s => s.NetworkName);
                        break; 
                    case "totalBudget":
                        if (sortBy.ToLower().Contains("desc"))
                            compaignsLst = compaignsLst.OrderByDescending(s => s.TotalBudget);
                        else
                            compaignsLst = compaignsLst.OrderBy(s => s.TotalBudget);
                        break;  
                    case "discount":
                        if (sortBy.ToLower().Contains("desc"))
                            compaignsLst = compaignsLst.OrderByDescending(s => s.Discount);
                        else
                            compaignsLst = compaignsLst.OrderBy(s => s.Discount);
                        break;                   
                    default:
                        if (sortBy.ToLower().Contains("desc"))
                            compaignsLst = compaignsLst.OrderByDescending(s => s.Id);
                        else
                            compaignsLst = compaignsLst.OrderBy(s => s.Id);
                        break;
                }
            }
          
            var totalRecordCount = dnlist.ToList().Count;
            int totalPages = Convert.ToInt32((((float)totalRecordCount) / ((float)length) + 0.5));
            //avmlist.Skip((pageNo - 1) + length).Take(length).ToList();
            GridResponseViewModel gridResult = new GridResponseViewModel();
            // GRID PAGINATION WORK
            gridResult.page = pageNo;
            gridResult.records = totalRecordCount;
            gridResult.total = (int)Math.Ceiling((double)totalRecordCount / length);
            gridResult.rows = compaignsLst.Skip((pageNo - 1) * length).Take(length).ToList<CompaignsViewModel>();
            // };

            return gridResult;
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
        [HttpPost]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<BlazorResponseViewModel> postCompaignData([FromBody] CompaignsViewModel model)
        {
            BlazorResponseViewModel response = new BlazorResponseViewModel();
            if (model == null) return new BlazorResponseViewModel { message = "Incomplete Data", data = null, status = false };
            try
            {
                int UserId = 0;
                if (this.User != null && this.User.Claims.Where(x => x.Type == "UserId").FirstOrDefault() != null)
                    UserId = Convert.ToInt32(this.User.Claims.Where(x => x.Type == "UserId").FirstOrDefault().Value);
                // string token = UTIL.CryptoEngine.Encrypt(Convert.ToString(UTIL.PackageUtil.GenerateRandomNo()) + UTIL.BlazorConstants.TOKEN_EXTERNAL_DELIMETER + id.ToString(), true, UTIL.Configurations.SecKeyCode);
                model.LastUpdatedBy = model.LastUpdatedBy == null? UserId: model.LastUpdatedBy;
                model.CreatedBy = model.CreatedBy == null ? UserId : model.CreatedBy;
                response = await _blazorRepoPageService.postCompaignData(model, UserId);

                response.message = String.Format(BlazorConstant.INSERTED_SUCCESS_API, model.Title, GlobalUTIL.CurrentDateTime.ToString());
                // response.status = false;

            }
            catch (Exception ex)
            {
                response.status = false;
                response.message = ex.Message;
            }
            return response;

        }
        [HttpPost]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<BlazorResponseViewModel> updateCompaign(CompaignsViewModel model)
        {
            BlazorResponseViewModel response = new BlazorResponseViewModel();
            try
            {
                int UserId = 0;
                if (this.User != null && this.User.Claims.Where(x => x.Type == "UserId").FirstOrDefault() != null)
                    UserId = Convert.ToInt32(this.User.Claims.Where(x => x.Type == "UserId").FirstOrDefault().Value);
               CompaignModel cModel = new CompaignModel { Id = model.Id };
                // string token = UTIL.CryptoEngine.Encrypt(Convert.ToString(UTIL.PackageUtil.GenerateRandomNo()) + UTIL.BlazorConstants.TOKEN_EXTERNAL_DELIMETER + id.ToString(), true, UTIL.Configurations.SecKeyCode);
                var ls = await _compaignService.GetCompainListAllFiltersAsync(cModel);
                if (ls.Any())
                {
                    cModel = ls.FirstOrDefault();
                    cModel.Status = model.Status<= 0 ?(int)COMPAIGNS_STATUS.DROPPED: model.Status;
                    cModel.LastUpdatedBy = UserId;
                    cModel.LastUpdatedAt = System.DateTime.UtcNow;
                    await _compaignService.Update(cModel);
                    response.data = model;
                    response.status = true;
                    response.message = string.Format(BlazorConstant.UPDATED_SUCCESS, cModel.Name, System.DateTime.UtcNow.ToString());
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
            return response;

        }

    }
}