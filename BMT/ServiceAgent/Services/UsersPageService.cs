using Blazor.Web.UI.Interfaces;
using AutoMapper;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.model;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.util;
using com.blazor.bmt.core;
using System.Xml.Linq;
using Blazor.Web.Infrastructure.Services;

namespace Blazor.Web.UI.Services
{
    public class UsersPageService : IUsersPageService
    {
        private readonly IUsersService _usersAppService;
        private readonly IAddressService _addressService;
        // private readonly IUserRoleService _userRoleAppService;
        private readonly IMapper _mapper;
        private readonly ILogger<UsersPageService> _logger;

        public UsersPageService(IUsersService usersService, IAddressService addressService, IMapper mapper, ILogger<UsersPageService> logger)
        {
            _usersAppService = usersService ?? throw new ArgumentNullException(nameof(usersService));
            _addressService = addressService ?? throw new ArgumentNullException(nameof(addressService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<UserViewModel>> GetUsers()
        {

            var listByName = await _usersAppService.GetUsersList();
           // _addressService.GetAddressById
            var mappedByName = _mapper.Map<IEnumerable<UserViewModel>>(listByName);
            return mappedByName;
        }
       // Task<IEnumerable<UsersViewModel>> GetUsersBySearchFiltersAsync(string name, int status, DateTime dtFrom, DateTime dtTo);
        //public async Task<IEnumerable<UsersViewModel>> GetMerchantsBySearchFiltersAsync(UsersViewModel uvm)
        //{
        //    //GetMerchantsBySearchFiltersAsync
        //    // var entity = _mapper.Map<UsersModel>(uvm);
        //  // var list = await _usersAppService.GetMerchantsBySearchFiltersAsync(entity);
        //    // _addressService.GetAddressById
        //    var userList = _mapper.Map< IEnumerable<UsersViewModel>>(list);
        //    return userList;
        //}
        public async Task<IEnumerable<UserViewModel>> GetUsersBySearchFiltersAsync(int roleId, string name, int status, DateTime dtFrom, DateTime dtTo)
        {
            try { 
            var list = await _usersAppService.GetAllDspUsersList(new UserModel { id = 0, RoleId = roleId, Email = "", CreatedAt = dtFrom, LastUpdatedAt=dtTo, CityId = 0, Status = 0, OrgId = 0, RowVer = 0 });
            // _addressService.GetAddressById
            var userList = _mapper.Map<IEnumerable<UserViewModel>>(list);
            return userList;

            }
            catch (Exception ex) {
                _logger.LogError(ex.StackTrace);
                return null;
            }
        }
             public async Task<IEnumerable<EnumViewModel>> GetUsersKeyValueCollectionMerchants(int orgId, USERROLES userRole)
        {

            var urs = await _usersAppService.GetUsersByDspAndRole((int)userRole, orgId);
            var urslist = urs.Where(x => x.OrgId == (orgId <= 0 ? x.OrgId : orgId)).ToList().Select(user => new EnumViewModel
            {
                id = user.Id,
                name = user.FirstName + " " + user.MiddleName + " " + user.LastName

            }).ToList();

            // var mappedByName = _mapper.Map<IEnumerable<EnumViewModel>>(authors);
            return urslist;
        }
        public async Task<IEnumerable<EnumViewModel>> GetUsersKeyValueCollection(USERROLES userRole)
        {

            var urs = await _usersAppService.GetUsersByDspAndRole((int)userRole, 0);
            var urslist = urs.ToList().Select(user => new EnumViewModel           
            {
                id = user.Id,
                name = user.FirstName + " " + user.MiddleName + " " + user.LastName

            }).ToList();

            // var mappedByName = _mapper.Map<IEnumerable<EnumViewModel>>(authors);
            return urslist;
        }
        public async Task<IEnumerable<EnumViewModel>> GetSubscriberKeyValueCollection()
        {

            var sbr = await _usersAppService.GetUsersByDspAndRole((int)USERROLES.PUBLIC_USER,0);
            var sbrlist = sbr.ToList().Select(subscriber => new EnumViewModel
            {
                id = subscriber.Id,
                name = subscriber.FirstName + " " + subscriber.MiddleName + " " + subscriber.LastName

            }).ToList();

            // var mappedByName = _mapper.Map<IEnumerable<EnumViewModel>>(authors);
            return sbrlist;
        }
        public async Task<AddressViewModel> GetUserAddress(int userId)
        {
            try
            {
                var addressModel = await _addressService.GetAddressById(userId);
                // _addressService.GetAddressById
                var addressViewModel = _mapper.Map<AddressViewModel>(addressModel);
                return addressViewModel;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                return null;
            }
          
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
                var ulst = await _usersAppService.GetAllUsersList(new UserModel { id = 0, OrgId = 0, Email = (email.Contains("p_") && email.Contains(".")) ? email : "", UserName = !(email.Contains("p_") && email.Contains(".")) ? email : "",  RowVer = 0, CreatedAt = GlobalUTIL.CurrentDateTime.AddYears(-10), Status = 0, LastName = "", FirstName = "", RoleId = 0, Password = "" });
                if (ulst.Any())
                {
                    dUser = ulst.FirstOrDefault();
                    if (dUser != null && (dUser.Email == email || dUser.UserName == email) && string.IsNullOrWhiteSpace(pwd) && !String.IsNullOrEmpty(finalToken))// && dUser.Status == (int)UTIL.COMMON_STATUS.ACTIVE)
                    {
                        // User Inactivated and 
                        dUser.Status = (int)COMMON_STATUS.IN_ACTIVE;
                        dUser.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                      //  dUser.Token = finalToken;
                        dUser.RowVer = dUser.RowVer + 1;
                        dUser.Password = string.Empty;
                        await _usersAppService.Update(dUser);
                        blazorApiResponse.message = string.Format("success, security token is {0} .", finalToken);
                        blazorApiResponse.data = dUser;
                        blazorApiResponse.status = true;
                        //emailbody = string.Format("Your security token is {0}, please use this token for password reset.", finalToken);
                    }
                    else if (dUser != null && !String.IsNullOrEmpty(pwd) && dUser.Status != (int)COMMON_STATUS.ACTIVE)
                    {
                        //dUser.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                        dUser.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                        // dUser.Token = finalToken;
                        dUser.RowVer = dUser.RowVer + 1;
                        dUser.Status = (int)COMMON_STATUS.ACTIVE;
                        dUser.Password = string.IsNullOrWhiteSpace(pwd) ? string.Empty : GlobalUTIL.Encrypt(System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(("" + pwd).Trim())), true, BlazorConstant.SECKEY); ;
                        await _usersAppService.Update(dUser);
                        blazorApiResponse.message = string.Format("password has been changed using security token  {0} .", finalToken);
                        blazorApiResponse.data = dUser;
                        blazorApiResponse.status = true;
                        //emailbody = string.Format("Your password has been changed successfully at {0}, thank you for using 4DSPS services.", GlobalUTIL.CurrentDateTime);
                    }
                    // Send Email
                    if (blazorApiResponse.status && !string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(pwd) && !string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
                    {
                        await mailSender.SendResetEmailNotificationAsync( dUser.Email, "",  finalToken);
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
        public async Task<BlazorResponseViewModel> changePassword(Int32 UserId, string pwd)
        {
            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {
                string emailbody = string.Empty;
                // it indicate first time send email, then 2nd time just verifying
                var dUser = await _usersAppService.GetUsersById(UserId);
                if (dUser != null)
                {

                    if (dUser != null && !String.IsNullOrEmpty(pwd))// && dUser.Status == (int)UTIL.COMMON_STATUS.ACTIVE)
                    {
                        // User Inactivated and                       
                        dUser.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                        dUser.RowVer = dUser.RowVer + 1;
                        dUser.Password = string.IsNullOrWhiteSpace(pwd) ? string.Empty : GlobalUTIL.Encrypt(System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(("" + pwd).Trim())), true, BlazorConstant.SECKEY); ;
                        await _usersAppService.Update(dUser);
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
        public async Task<UserViewModel> GetUserByEmailSync(int roleId, string email)
        {

            try
            {
                var usrModel = await _usersAppService.GetAllDspUsersList(new UserModel { id = 0, RoleId = roleId, Email = email, CreatedAt = GlobalUTIL.CurrentDateTime.AddYears(-5), CityId = 0, Status = 0, OrgId = 0, RowVer = 0 });
                // _addressService.GetAddressById
                var userviewModel = _mapper.Map<UserViewModel>(usrModel);
                return userviewModel;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                return null;
            }
            
        }
        public async Task<IEnumerable<UserViewModel>> GetUsers(string name)
        {
            try
            {
                var listByName = await _usersAppService.GetUsersByName(name);
                var mappedByName = _mapper.Map<IEnumerable<UserViewModel>>(listByName);
                return mappedByName;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                return null;
            }
           
        }
        public async Task<UserViewModel> GetUserById(int id)
        {
            var auther = await _usersAppService.GetUsersById(id);
            var mappedByName = _mapper.Map<UserViewModel>(auther);
        //  var mapped = _mapper.Map<IEnumerable<PriceViewModel>>(list);
            return mappedByName;
        }
        public async Task<IEnumerable<UserViewModel>> GetUsersByRole(int id)
        {
            var userList = await _usersAppService.GetUsersById(id);
            var mappedByName = _mapper.Map<IEnumerable<UserViewModel>>(userList);
            return mappedByName;
        }
        public async Task<IEnumerable<UserViewModel>> GetUsersByRole(USERROLES role)
        {
            var list = await _usersAppService.GetAllDspUsersList(new UserModel { id = 0, RoleId = (int)role, FirstName = "", Email = "", CreatedAt =  GlobalUTIL.CurrentDateTime.AddYears(-5) ,  CityId = 0, Status = 0, OrgId = 0, RowVer = 0 });
            var mapped = _mapper.Map<IEnumerable<UserViewModel>>(list);
            return mapped;  
        }
        public async Task<IEnumerable<UserViewModel>> GetUsersAllDetailList(int userId ,int roleId,string name, int status, DateTime? dtFrom, DateTime? dtTo )
        {
            try
            {
                dtFrom = Convert.ToDateTime(dtFrom).Year <= 1900 || dtFrom == null ? new DateTime(1900, 1, 1) : dtFrom;
                dtTo = Convert.ToDateTime(dtTo).Year <= 1900 || dtTo == null ? System.DateTime.Now : dtTo;
                name = userId > 0 ? string.Empty : name;
                var list =await _usersAppService.GetAllDspUsersList(new UserModel { id = userId, RoleId = roleId,FirstName= name, Email = "", CreatedAt = (dtFrom==null?GlobalUTIL.CurrentDateTime.AddYears(-5): Convert.ToDateTime(dtFrom)), LastUpdatedAt = dtTo, CityId = 0, Status = 0, OrgId = 0, RowVer = 0 });
                var mapped = _mapper.Map<IEnumerable<UserViewModel>>(list);
                return mapped.ToList();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                return null;
            }
           
        }

        public async Task<UserViewModel> CreateUser(UserViewModel UsersViewModel)
        {
            var mapped = _mapper.Map<UserModel>(UsersViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");           
            var entityDto = await _usersAppService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - UsersPageService");

            var mappedViewModel = _mapper.Map<UserViewModel>(entityDto);
            return mappedViewModel;
        }

        public async Task UpdateUser(UserViewModel UsersViewModel)
        {
            var mapped = _mapper.Map<UserModel>(UsersViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _usersAppService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - UsersPageService");
        }

        public async Task DeleteUser(UserViewModel UsersViewModel)
        {
            var mapped = _mapper.Map<UserModel>(UsersViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _usersAppService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - UsersPageService");
        }
    }
}
