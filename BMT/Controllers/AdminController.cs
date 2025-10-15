//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
using Blazor.Web.UI.Interfaces;
//using Blazor.Web.ViewModels;
//using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
//using Microsoft.AspNetCore.Cors;
//using Blazor.Web.Application.Interfaces;
//using Blazor.Web.Application.Models;
//using Microsoft.AspNetCore.Http.HttpResults;
//using Blazor.Web.UI.Services;
//using System.IO;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.application.model;
//using com.blazor.bmt.core;
namespace com.blazor.bmt.controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class AdminController : ControllerBase
    {
        // private readonly IOrga _organizationsService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;
        private readonly IPackageService _packageService;
        private readonly IBundlingPackageService _BundlingPackageService;
        private readonly IGlobalNetworkDetailService _GlobalNetworkDetailService;
        private readonly IBlazorUtilPageService _utilPageService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;

        //public IEnumerable<UserViewModel> usrvmodl { get; set; } = new List<UserViewModel>();
        public AdminController(IBundlingPackageService BundlingPackageService, IBlazorRepoPageService blazorRepoPageService, IGlobalNetworkDetailService globalNetworkDetailService, IPackageService packageService,IBlazorUtilPageService utilPageService,  IHttpContextAccessor httpContextAccessor, IMemoryCache cache)
        {
            _BundlingPackageService = BundlingPackageService ?? throw new ArgumentNullException(nameof(BundlingPackageService));
           // _usersPageService = usersPageService ?? throw new ArgumentNullException(nameof(usersPageService));
            _GlobalNetworkDetailService = globalNetworkDetailService ?? throw new ArgumentNullException(nameof(globalNetworkDetailService));
           // _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _utilPageService = utilPageService ?? throw new ArgumentNullException(nameof(utilPageService));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _packageService = packageService ?? throw new ArgumentNullException(nameof(packageService));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
           // _addressPageService = addressPageService ?? throw new ArgumentNullException(nameof(addressPageService));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
           // _donationsPageService = donationsPageService ?? throw new ArgumentNullException(nameof(donationsPageService));

        }
        [HttpGet("packageslist")]
        [HttpPost("packageslist")]
        [Route("packageslist")]
        public async Task<ActionResult> GetpackagesList()
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
                blazorApiResponse.status = true;
                blazorApiResponse.data = await _packageService.GetPackagesList("");

            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
               // _logger.LogError(ex.StackTrace);
            }
            return Ok(blazorApiResponse);
            // .ToArray();
        }
        [HttpGet("networks")]
        [HttpPost("networks")]
        [Route("networks")]
        public async Task<ActionResult> GetNetworksData()
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
                blazorApiResponse.status = true;
                blazorApiResponse.data = await _blazorRepoPageService.GetNetworkData(0);

            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                // _logger.LogError(ex.StackTrace);
            }
            return Ok(blazorApiResponse);
            // .ToArray();
        }
        [HttpGet("custombundlingdetails")]
        [HttpPost("custombundlingdetails")]
        [Route("custombundlingdetails")]
        public async Task<ActionResult> GetCustomBundlingDetails([FromBody] WebApiFilters filters)
        {
           // if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
                blazorApiResponse.status = true;
                // blazorApiResponse.data = await _blazorRepoPageService.LoadCustomBundlingPackagesData(0);
                blazorApiResponse.data = await _blazorRepoPageService.LoadOrgBundlingPackagesData(Convert.ToInt32(filters.orgId), Convert.ToInt32(filters.id));

            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                // _logger.LogError(ex.StackTrace);
            }
            return Ok(blazorApiResponse);
            // .ToArray();
        }

        [HttpPost("updatepackage")]
        [Route("updatepackage")]
        public async Task<ActionResult> updatePackage([FromBody]PackageViewModel package)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
              
              if(package.Id > 0)
                {
                    // UsersViewModel User = new UsersViewModel();
                    PackageModel pkg = await _packageService.GetPackageByIdAsync(package.Id);
                    // OrganizationModel organization = new OrganizationModel();
                    pkg.CreatedBy = package.CreatedBy;
                    pkg.LastUpdatedBy = package.LastUpdatedBy;
                    pkg.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    pkg.Discount = package.Discount; 
                    pkg.PackageInDays = package.PackageInDays;
                    pkg.Fee = package.Fee;
                    pkg.EarlyBirdDiscount = package.EarlyBirdDiscount;
                    //  user.ExpireTime = System.DateTime.Now.AddDays(UTIL.PackageUtil.getPackageDays(Convert.ToInt32(user.SchoolId)));
                    pkg.Status = package.Status == 0 ? (int)util.COMMON_STATUS.ACTIVE : package.Status;
                    //user.SubscriptionPackageId = user.SubscriptionPackageId;
                    pkg.RowVer = pkg.RowVer + 1;
                     pkg = await _packageService.Update(pkg);

                    blazorApiResponse.status = true;
                    if (pkg.id > 0)
                        blazorApiResponse.message = string.Format(util.BlazorConstant.UPDATED_SUCCESS, (pkg.Name), System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss")); //: "Now that you’ve completed your registration, we want you to start to think about your Business Plan. If you could start a business what would it be? Who would be your customers? Why would your business be important? Begin to fill out the Business Plan and YMC Admin will help you along the way. When you have your initial ideas filled out click the submit button and we will review your plan and give you feedback. Remember, the faster you complete your Business Plan, the faster we can post it and you can begin to collect funds from sponsors!";
                    else
                        blazorApiResponse.message = string.Format(util.BlazorConstant.INSERTED_FAILED, (pkg.Name), System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss"));

                }
                //  BlazorResponseViewModel.status = true;
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                blazorApiResponse.message = string.Format(util.BlazorConstant.UPDATE_FAILED, (package.Name), (ex.InnerException == null ? ex.Message : ex.InnerException.Message));//: string.Format(UTIL.BlazorConstants.MERCHANT_ACTIVATION_FAILED, (uvm.FirstName + " " + uvm.LastName), (ex.InnerException == null ? ex.Message : ex.InnerException.Message)));

                blazorApiResponse.status = false;
            }
            return Ok(blazorApiResponse);
        }
        [HttpPost("updatebundlingdetail")]
        [Route("updatebundlingdetail")]
        public async Task<ActionResult> updateBundlingPackage(BundlingpackagedetailViewModel bpackage)

        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            //string retURL = string.Empty;
            try
            {               

                if (bpackage.Id > 0)
                {
                    // UsersViewModel User = new UsersViewModel();
                    BundlingpackagedetailModel pkg = await _BundlingPackageService.GetBundlingPackageByIdAsync(bpackage.Id);
                    // OrganizationModel organization = new OrganizationModel();
                    bpackage.LastUpdatedBy = bpackage.LastUpdatedBy;
                    bpackage.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                    pkg.Discount = bpackage.Discount;
                    pkg.UnitPrice = bpackage.UnitPrice;
                    pkg.FreeAllowed = bpackage.FreeAllowed;
                    pkg.Tax = bpackage.Tax == null ? 0.0 : bpackage.Tax;
                    pkg.NetworkId = bpackage.NetworkId;
                    pkg.FinishTime = bpackage.FinishTime;
                    pkg.CurrentApplied = bpackage.CurrentApplied;
                    pkg.StartTime = bpackage.StartTime;
                    pkg.CreatedBy = pkg.CreatedBy;
                    pkg.CreatedAt = pkg.CreatedAt;

                    //  user.ExpireTime = System.DateTime.Now.AddDays(UTIL.PackageUtil.getPackageDays(Convert.ToInt32(user.SchoolId)));
                    bpackage.Status = bpackage.Status == 0 ? (int)util.COMMON_STATUS.ACTIVE : bpackage.Status;
                    //user.SubscriptionPackageId = user.SubscriptionPackageId;
                    bpackage.RowVer = bpackage.RowVer + 1;
                    bpackage = await _BundlingPackageService.Update(bpackage);

                    blazorApiResponse.status = true;
                    if (bpackage.Id > 0)
                        blazorApiResponse.message = string.Format(util.BlazorConstant.UPDATED_SUCCESS, (bpackage.Name), System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss")); //: "Now that you’ve completed your registration, we want you to start to think about your Business Plan. If you could start a business what would it be? Who would be your customers? Why would your business be important? Begin to fill out the Business Plan and YMC Admin will help you along the way. When you have your initial ideas filled out click the submit button and we will review your plan and give you feedback. Remember, the faster you complete your Business Plan, the faster we can post it and you can begin to collect funds from sponsors!";
                    else
                        blazorApiResponse.message = string.Format(BlazorConstant.INSERTED_FAILED, (bpackage.Name), System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss"));

                }
                //  BlazorResponseViewModel.status = true;
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                blazorApiResponse.message = string.Format(BlazorConstant.UPDATE_FAILED, (bpackage.Name), (ex.InnerException == null ? ex.Message : ex.InnerException.Message));//: string.Format(UTIL.BlazorConstants.MERCHANT_ACTIVATION_FAILED, (uvm.FirstName + " " + uvm.LastName), (ex.InnerException == null ? ex.Message : ex.InnerException.Message)));

            }
            return Ok(blazorApiResponse); 
        }

        [HttpGet("bundlingdetails")]
        [HttpPost("bundlingdetails")]
        [Route("bundlingdetails")]
        public async Task<ActionResult> GetBundlingDetails([FromBody] WebApiFilters filters)
        {
            // if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                //var uvmr = UTIL.userls.Where(x => x.storeid == cvm.storeid && x.username == cvm.username && x.status == cvm.status && x.password == uvm.password);
               
                blazorApiResponse.data = await _BundlingPackageService.GetBundlingPackageAllFiltersAsync(Convert.ToInt32(filters.id), Convert.ToInt32(filters.status));
                blazorApiResponse.status = true;
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                // _logger.LogError(ex.StackTrace);
            }
            return Ok(blazorApiResponse);
            // .ToArray();
        }


        [HttpPost("updatenetworsbulk")]
        [Route("updatenetworsbulk")]
        public async Task<ActionResult> UpdateNetworksBulk([FromBody] List<networkidvalues> mdls)
        {
            if (string.IsNullOrWhiteSpace(Request.Headers["Authorization"]) || (Convert.ToString(Request.Headers["Authorization"]).Contains(BlazorConstant.API_AUTH_KEY) == false)) return Ok(new BlazorApiResponse { status = false, errorCode = "405", effectedRows = 0, data = "Authorization Failed" });
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try
            {
                var response =  await _blazorRepoPageService.UpdateNetworksData(mdls, Convert.ToInt32(mdls.FirstOrDefault().CreatedBy));
                blazorApiResponse.data = response.data;
                blazorApiResponse.status = true;
                if (mdls.Any())
                    blazorApiResponse.message = string.Format(util.BlazorConstant.UPDATED_SUCCESS, (mdls.Count), System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss")); //: "Now that you’ve completed your registration, we want you to start to think about your Business Plan. If you could start a business what would it be? Who would be your customers? Why would your business be important? Begin to fill out the Business Plan and YMC Admin will help you along the way. When you have your initial ideas filled out click the submit button and we will review your plan and give you feedback. Remember, the faster you complete your Business Plan, the faster we can post it and you can begin to collect funds from sponsors!";
                else
                    blazorApiResponse.message = string.Format(BlazorConstant.INSERTED_FAILED, (mdls.Count), System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss"));

           
                //  BlazorResponseViewModel.status = true;
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                blazorApiResponse.message = string.Format(BlazorConstant.UPDATE_FAILED, "Networks Settings", (ex.InnerException == null ? ex.Message : ex.InnerException.Message));//: string.Format(UTIL.BlazorConstants.MERCHANT_ACTIVATION_FAILED, (uvm.FirstName + " " + uvm.LastName), (ex.InnerException == null ? ex.Message : ex.InnerException.Message)));

            }
            return Ok(blazorApiResponse);

}
    }
}