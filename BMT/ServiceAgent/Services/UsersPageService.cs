using AutoMapper;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.model;
using com.blazor.bmt.util;
using System.Collections.Generic;
using Org.BouncyCastle.Asn1.Ocsp;
using Blazor.Web.Infrastructure.Services;

namespace com.blazor.bmt.ui.services
{
    public class UsersPageService : IUsersPageService
    {
        private readonly IUsersService _userAppService;
       //private readonly ICategoryService _categoryAppService;
        private readonly IMapper _mapper;
        private readonly ILogger<UsersPageService> _logger;

        public UsersPageService(IUsersService usersService, IMapper mapper, ILogger<UsersPageService> logger)
        {
            _userAppService = usersService ?? throw new ArgumentNullException(nameof(usersService));
           // _categoryAppService = categoryAppService ?? throw new ArgumentNullException(nameof(categoryAppService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        public async Task<IEnumerable<UserViewModel>> GetDspMobileUsersListAllAsync(UserViewModel uvm) {
            var umodel = _mapper.Map<UserModel>(uvm);
            var list = await _userAppService.GetMobileUsersByAllFiltersAsync(umodel);
            var mapped = _mapper.Map<IEnumerable<UserViewModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<UserViewModel>> GetUsersListAsync(int dspId, int roleId)
        {
            //if (string.IsNullOrWhiteSpace(productName))
           // {
                var list = await _userAppService.GetUsersList();
                var mapped = _mapper.Map<IEnumerable<UserViewModel>>(list);
                return mapped;
           
        }
        public async Task<IEnumerable<UserViewModel>> GetUsersListAllAsync(UserViewModel uvm)
        {
            //if (string.IsNullOrWhiteSpace(productName))
            try
            {
                uvm.Dspid = uvm.Dspid == null ? 0 : uvm.Dspid;
                // uvm.storeid = uvm.id ? "0" : uvm.storeid;
                var umodel = _mapper.Map<UserModel>(uvm);
                var lst = await _userAppService.GetAllUsersList(umodel);
                var mapped = _mapper.Map<IEnumerable<UserViewModel>>(lst);
                return mapped;
            }
            catch (Exception ex) {
                return null;
            }
        }
        public async Task<IEnumerable<UserViewModel>> GetDspUsersListAllAsync(UserViewModel uvm) {
            //if (string.IsNullOrWhiteSpace(productName))
            try {
                uvm.Dspid = uvm.Dspid==null ? 0 : uvm.Dspid;               
                var umodel = _mapper.Map<UserModel>(uvm);
                var lst = await _userAppService.GetAllDspUsersList(umodel);
                var mapped = _mapper.Map<IEnumerable<UserViewModel>>(lst);
                return mapped;
            }
            catch (Exception ex) {
                return null;
            }
        }
        public async Task<IEnumerable<UserViewModel>> GetUsersListAsync(int dspId, int roleId, string name)
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _userAppService.GetUsersByName(name);
            var mapped = _mapper.Map<IEnumerable<UserViewModel>>(list);
            return mapped;

        }
        public async Task<BlazorResponseViewModel> forgotPassword(string email, string token, string pwd)
        {
            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            UserModel dUser = new UserModel();
            EmailSender mailSender = new EmailSender();
            string finalToken = string.IsNullOrWhiteSpace(token) && string.IsNullOrWhiteSpace(pwd) ? (new Random()).Next(90000000).ToString() : token;
            try
            {
                //string emailbody = string.Empty;
                // it indicate first time send email, then 2nd time just verifying
                    var ulst = await _userAppService.GetAllUsersList(new UserModel { id = 0, Dspid = 0, Email = (email.Contains("@") && email.Contains("."))? email:"", UserName = !(email.Contains("@") && email.Contains(".")) ? email : "",  Token = token, RowVer = 0, CreatedAt = GlobalUTIL.CurrentDateTime.AddYears(-10), Status = 0, LastName = "", FirstName = "", RoleId = 0, Password = "", UserId = "" });
                    if (ulst.Any())
                    {
                        dUser = ulst.FirstOrDefault();
                    if (dUser != null && (dUser.Email == email  || dUser.UserName == email) && string.IsNullOrWhiteSpace(pwd) && !String.IsNullOrEmpty(finalToken))// && dUser.Status == (int)UTIL.COMMON_STATUS.ACTIVE)
                        {
                            // User Inactivated and 
                            dUser.Status = (int)UTIL.COMMON_STATUS.INACTIVE;
                            dUser.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                            dUser.Token = finalToken;
                            dUser.RowVer = dUser.RowVer+1;
                            dUser.Password = string.Empty;
                           await  _userAppService.Update(dUser);
                            blazorApiResponse.message = string.Format("success, security token is {0} .", finalToken);
                            blazorApiResponse.data = dUser;
                            blazorApiResponse.status = true;
                        //emailbody = string.Format("Your security token is {0}, please use this token for password reset.", finalToken);
                        }
                        else if (dUser != null &&  !String.IsNullOrEmpty(pwd) && dUser.Status != (int)util.UTIL.COMMON_STATUS.ACTIVE)
                        {
                            //dUser.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                            dUser.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                           // dUser.Token = finalToken;
                            dUser.RowVer = dUser.RowVer + 1;
                            dUser.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                            dUser.Password = string.IsNullOrWhiteSpace(pwd) ? string.Empty : GlobalUTIL.Encrypt(System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(("" + pwd).Trim())), true, BlazorConstant.SECKEY); ;
                            await _userAppService.Update(dUser);
                            blazorApiResponse.message = string.Format("password has been changed using security token  {0} .", finalToken);
                            blazorApiResponse.data = dUser;
                            blazorApiResponse.status = true;
                        //emailbody = string.Format("Your password has been changed successfully at {0}, thank you for using 4DSPS services.", GlobalUTIL.CurrentDateTime);
                    }
                    // Send Email
                        if (blazorApiResponse.status && !string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(pwd) && !string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
                        { 
                            await mailSender.SendResetEmailNotificationAsync(Convert.ToInt32(dUser.Dspid), dUser.Email,"","", finalToken);
                        }

                    } 
           
                  return blazorApiResponse;

            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
               // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            finally { 
                
            }

            return blazorApiResponse;

        }
        public async Task<BlazorResponseViewModel> changePassword(Int32 UserId,  string pwd)
        {
            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {
                string emailbody = string.Empty;
                // it indicate first time send email, then 2nd time just verifying
                var dUser = await _userAppService.GetUsersById(UserId);
                if (dUser != null)
                {
                  
                    if (dUser != null && !String.IsNullOrEmpty(pwd))// && dUser.Status == (int)UTIL.COMMON_STATUS.ACTIVE)
                    {
                        // User Inactivated and                       
                        dUser.LastUpdatedAt = GlobalUTIL.CurrentDateTime;                       
                        dUser.RowVer = dUser.RowVer + 1;
                        dUser.Password = string.IsNullOrWhiteSpace(pwd) ? string.Empty : GlobalUTIL.Encrypt(System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(("" + pwd).Trim())), true, BlazorConstant.SECKEY); ;
                        await _userAppService.Update(dUser);
                        blazorApiResponse.message = "Password changed successfully";
                        blazorApiResponse.data = dUser;
                        blazorApiResponse.status = true;                        
                    }                   

                }

                return blazorApiResponse;

            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            finally
            {

            }

            return blazorApiResponse;

        }
        public async Task<UserViewModel> GetUserById(int id)
        {
            var model = await _userAppService.GetUsersById(id);
            var mapped = _mapper.Map<UserViewModel>(model);
            return mapped;
        }
        public async Task<IEnumerable<UserViewModel>> GetUserByByEmail(string email, string username)
        {
            var ls = await _userAppService.GetAllUsersList(new UserModel {  id=0, Dspid=0, Email= email, UserName= username, RowVer=0, CreatedAt= GlobalUTIL.CurrentDateTime.AddYears(-10), Status=0 , LastName="", FirstName="", RoleId=0, Password="",  UserId="" });
            //var mapped = _mapper.Map<IEnumerable<UserViewModel>>(UserViewModel >>(modmodelel);
            var mapped = _mapper.Map<IEnumerable<UserViewModel>>(ls);
            return mapped;
        }

        public async Task<IEnumerable<UserViewModel>> GetUsersByDspAndRole(int dspId, int roleId)
        {
            var list = await _userAppService.GetUsersByDspAndRole(roleId, dspId);
            var mapped = _mapper.Map<IEnumerable<UserViewModel>>(list);
            return mapped;
        }

       

        public async Task<UserViewModel> Create(UserViewModel vModel)
        {
            var mapped = _mapper.Map<UserModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _userAppService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - UserPageService");

            var mappedViewModel = _mapper.Map<UserViewModel>(entityDto);
            return mappedViewModel;
        }

        public async Task Update(UserViewModel vmodel)
        {
            var mapped = _mapper.Map<UserModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _userAppService.Update(mapped);
           _logger.LogInformation($"Entity successfully added - UserPageService");
        }

        public async Task Delete(UserViewModel vmodel){
            var mapped = _mapper.Map<UserModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _userAppService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - UserPageService");
        }
    }
}
