
using Blazor.Web.UI.Interfaces;
// Microsoft Namespaces
using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.application.model;

namespace Blazor.Web.UI.Services
{
    public class NotificationPageService : INotificationPageService
    {
        private readonly INotificationService _notificationService;       
        private readonly IMapper _mapper;
        private readonly ILogger<NotificationPageService> _logger;
        private readonly IOnlineUsersService _onlineUsersService;
        public NotificationPageService(INotificationService notificationService, IOnlineUsersService onlineUsersService, IMapper mapper, ILogger<NotificationPageService> logger)
        {   _notificationService = notificationService ?? throw new ArgumentNullException(nameof(notificationService));
            _onlineUsersService = onlineUsersService ?? throw new ArgumentNullException(nameof(onlineUsersService));           
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
           
        }
     
        public async Task<IEnumerable<NotificationViewModel>> GetNotificationList()
        {

            var address = await _notificationService.GetNotificationList();
            var list = _mapper.Map<IEnumerable<NotificationViewModel>>(address);
            return list;
        }

        public async Task<OnlineuserModel> loggedIn(UserViewModel usr, string remoteMachineIp)
        {
            OnlineuserModel uolm = new OnlineuserModel();
            try
            {if (usr != null) { 
                uolm = await _onlineUsersService.GetOnlineUserByIdAsync(usr.Id);
            if (uolm == null || uolm.UserId == 0)
            {
                    uolm = new OnlineuserModel();
                    uolm.UserId = usr.Id;
                    uolm.LoginTime = System.DateTime.Now;
                    uolm.MachineIp = remoteMachineIp;
                    uolm.Status = (int)LOGIN_ACTIVITY.LOGGED_IN;
                     await _onlineUsersService.Create(uolm);

                }
            else {

                    uolm.Status = (int)LOGIN_ACTIVITY.LOGGED_IN;
                    uolm.LoginTime = System.DateTime.Now;
                    uolm.MachineIp = remoteMachineIp;
                    await _onlineUsersService.Update(uolm);
                }
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.StackTrace);
               // throw ex;
            }
            return uolm;
        }
        public async Task<OnlineuserModel> loggedOut(string remoteMachineIp, int userId)
        {
            OnlineuserModel usronlineModel = new OnlineuserModel();
            try
            {
                usronlineModel = await _onlineUsersService.GetOnlineUserByIdAsync(userId);
                if (usronlineModel == null || usronlineModel.UserId ==0)
                {
                    usronlineModel = new OnlineuserModel();
                    usronlineModel.UserId = userId;
                    usronlineModel.LoginTime = System.DateTime.Now.AddMinutes(-10);
                    usronlineModel.LogoutTime = System.DateTime.Now;
                    usronlineModel.MachineIp = remoteMachineIp;
                    usronlineModel.Status = (int)LOGIN_ACTIVITY.LOGGED_OUT;
                    usronlineModel = await _onlineUsersService.Create(usronlineModel);
                }
                else
                {
                    usronlineModel.Status = (int)LOGIN_ACTIVITY.LOGGED_OUT;
                    usronlineModel.LogoutTime = System.DateTime.Now;
                    usronlineModel.MachineIp = remoteMachineIp;
                    await _onlineUsersService.Update(usronlineModel);
                }

            }
            catch (Exception ex) {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return usronlineModel;
        }
        
            public async Task<IEnumerable<NotificationViewModel>> GetNotificationAllFiltersLogDetails(NotificationViewModel notificationViewModel)
        {
            var mapped = _mapper.Map<NotificationModel>(notificationViewModel);
            var list = await _notificationService.GetNotificationAllFiltersLogDetails(mapped);
            var retEntity = _mapper.Map<IEnumerable<NotificationViewModel>>(list);
            return retEntity;
        }
        public async Task<IEnumerable<NotificationViewModel>> GetNotificationDetails(NotificationViewModel notificationViewModel)
        {
            var mapped = _mapper.Map<NotificationModel>(notificationViewModel);
            var list = await _notificationService.GetNotificationDetails(mapped);
            var retEntity = _mapper.Map<IEnumerable<NotificationViewModel>>(list);
            return retEntity;
        }
        public async Task<IEnumerable<NotificationViewModel>> GetNotificationByDateRangeAndStatusAsync(STATUS_NOTIFICATION status, DateTime dtFrom , DateTime dtTo )
        {
          
            var list = await _notificationService.GetNotificationByDateRangeAndStatus(status, dtFrom, dtTo);
            var retEntity = _mapper.Map<IEnumerable<NotificationViewModel>>(list);
            return retEntity;
        }
        public async Task<IEnumerable<NotificationViewModel>> GetNotificationBySearchKeyword(string keyword)
        {
            var list = await _notificationService.GetNotificationBySearchKeyword(keyword);
            var retEntity = _mapper.Map<IEnumerable<NotificationViewModel>>(list);
            return retEntity;
        }
        public async Task<NotificationViewModel> GetNotificationById(long NotificationId)
        {
            var entity = await _notificationService.GetNotificationById(NotificationId);
            var retEntity = _mapper.Map<NotificationViewModel>(entity);
        //  var mapped = _mapper.Map<IEnumerable<PriceViewModel>>(list);
            return retEntity;
        }

        public async Task<NotificationViewModel> CreateNotification(NotificationViewModel notificationViewModel)
        {
            var mapped = _mapper.Map<NotificationModel>(notificationViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");           
            var entityDto = await _notificationService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - NotificationPageService");

            var mappedViewModel = _mapper.Map<NotificationViewModel>(entityDto);
            return mappedViewModel;
        }
        public async Task<IEnumerable<NotificationViewModel>> AddUpdateNofications(List<NotificationViewModel> nlst)
        {
            var clst = _mapper.Map<IEnumerable<NotificationModel>>(nlst);
            if (clst == null)
                throw new Exception($"Entity could not be mapped.");
            var dlst = await _notificationService.InsertUpdateBulk(clst.ToList());
            _logger.LogInformation($"Entity successfully added - NotificationPageService");

            var ulst = _mapper.Map<IEnumerable<NotificationViewModel>>(dlst);
            return ulst;
        }
        public async Task UpdateNotification(NotificationViewModel notificationViewModel)
        {
            var mapped = _mapper.Map<NotificationModel>(notificationViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _notificationService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - NotificationPageService");
        }

        public async Task DeleteNotification(NotificationViewModel notificationViewModel)
        {
            throw new Exception("Not implemented");
            //var mapped = _mapper.Map<AppLogModel>(appLogViewModel);
            //if (mapped == null)
            //    throw new Exception($"Entity could not be mapped.");

            //await _appLogService.Delete(mapped);
            //_logger.LogInformation($"Entity successfully added - NotificationPageService");
        }
    }
}
