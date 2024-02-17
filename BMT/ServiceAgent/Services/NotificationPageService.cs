using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.services
{
    public class NotificationPageService : INotificationPageService
    {

        private readonly INotificationService _notificationService;
        private readonly IOnlineUsersService _onlineUsersService;
        private readonly IMapper _mapper;
        private readonly ILogger<NotificationPageService> _logger;
        public NotificationPageService(INotificationService notificationService, IOnlineUsersService onlineUsersService, IMapper mapper, ILogger<NotificationPageService> logger)
        {
            _notificationService = notificationService ?? throw new ArgumentNullException(nameof(notificationService));
            _onlineUsersService = onlineUsersService ?? throw new ArgumentNullException(nameof(onlineUsersService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<OnlineuserModel> loggedIn(LoginViewModel usr, string remoteMachineIp)
        {
            OnlineuserModel uolm = new OnlineuserModel();
            try
            {
                if (usr != null)
                {
                    uolm = await _onlineUsersService.GetOnlineUserByIdAsync(usr.Id);
                    if (uolm == null || uolm.UserId == 0)
                    {
                        uolm = new OnlineuserModel();
                        uolm.UserId = usr.Id;
                        uolm.LoginTime = System.DateTime.Now;
                        uolm.MachineIp = remoteMachineIp;
                        uolm.Status = (int)UTIL.LOGIN_ACTIVITY.LOGGED_IN;
                        await _onlineUsersService.Create(uolm);

                    }
                    else
                    {

                        uolm.Status = (int)UTIL.LOGIN_ACTIVITY.LOGGED_IN;
                        uolm.LoginTime = System.DateTime.Now;
                        uolm.MachineIp = remoteMachineIp;
                        await _onlineUsersService.Update(uolm);
                    }
                }
            }
            catch (Exception ex)
            {
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
                if (usronlineModel == null || usronlineModel.UserId == 0)
                {
                    usronlineModel = new OnlineuserModel();
                    usronlineModel.UserId = userId;
                    usronlineModel.LoginTime = System.DateTime.Now.AddMinutes(-10);
                    usronlineModel.LogoutTime = System.DateTime.Now;
                    usronlineModel.MachineIp = remoteMachineIp;
                    usronlineModel.Status = (int)UTIL.LOGIN_ACTIVITY.LOGGED_OUT;
                    usronlineModel = await _onlineUsersService.Create(usronlineModel);
                }
                else
                {
                    usronlineModel.Status = (int)UTIL.LOGIN_ACTIVITY.LOGGED_OUT;
                    usronlineModel.LogoutTime = System.DateTime.Now;
                    usronlineModel.MachineIp = remoteMachineIp;
                    await _onlineUsersService.Update(usronlineModel);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                // throw ex;
            }
            return usronlineModel;
        }

        public async Task<IEnumerable<NotificationViewModel>> GetNotificationList()
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _notificationService.GetNotificationList();
            var mapped = _mapper.Map<IEnumerable<NotificationViewModel>>(list);
            return mapped;

        }
        public async Task<IEnumerable<NotificationViewModel>> GetNotificationsByName(string name)
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _notificationService.GetNotificationsByName(name);
            var mapped = _mapper.Map<IEnumerable<NotificationViewModel>>(list);
            return mapped;

        }

        public async Task<NotificationViewModel> GetNotificationById(Int64 id)
        {
            var model = await _notificationService.GetNotificationById(id);
            var mapped = _mapper.Map<NotificationViewModel>(model);
            return mapped;
        }
        public async Task<IEnumerable<NotificationViewModel>> GetNotificationsAllFiltersAsync(NotificationViewModel model) {
            var CModel = _mapper.Map<NotificationModel>(model);
            var list = await _notificationService.GetNotificationsAllFiltersAsync(CModel);
            var mapped = _mapper.Map<IEnumerable<NotificationViewModel>>(list);
            return mapped;

        }
        public async Task<IEnumerable<NotificationViewModel>> GetNotificationsByCategoryAndStatusAsnc(int showRoomId, int status)
        {
            var list = await _notificationService.GetNotificationsByCategoryAndStatusAsnc(showRoomId, status);
            var mapped = _mapper.Map<IEnumerable<NotificationViewModel>>(list);
            return mapped;

        }
        public async Task<NotificationViewModel> Create(NotificationViewModel vModel)
        {
            var mapped = _mapper.Map<NotificationModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _notificationService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - NotificationPageService");

            var mappedViewModel = _mapper.Map<NotificationViewModel>(entityDto);
            return mappedViewModel;
        }

        public async Task Update(NotificationViewModel vmodel)
        {
            var mapped = _mapper.Map<NotificationModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _notificationService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - NotificationPageService");
        }

        public async Task Delete(NotificationViewModel vmodel)
        {
            var mapped = _mapper.Map<NotificationModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _notificationService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - NotificationPageService");
        }
    }
    }

