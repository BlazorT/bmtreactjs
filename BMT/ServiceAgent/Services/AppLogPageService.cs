// Microsoft Namespaces
using AutoMapper;
using Blazor.Web.Application.Interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;
namespace com.blazor.bmt.ui.services
{
    public class AppLogPageService : IAppLogPageService
    {
        private readonly IAppLogService _appLogService;
      
        private readonly IMapper _mapper;
        private readonly ILogger<AppLogPageService> _logger;

        public AppLogPageService(IAppLogService appLogService, IMapper mapper,  ILogger<AppLogPageService> logger)
        {
            _appLogService = appLogService ?? throw new ArgumentNullException(nameof(appLogService));
           
            //_categoryAppService = categoryAppService ?? throw new ArgumentNullException(nameof(categoryAppService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<AppLogViewModel>> GetAppLogs()
        {

            var address = await _appLogService.GetApplogList();
            var mappedByName = _mapper.Map<IEnumerable<AppLogViewModel>>(address);
            return mappedByName;
        }
        public async Task<IEnumerable<AppLogViewModel>> GetAppLogs(string keyword)
        {
            var list = await _appLogService.GetLogBySearchKeyword(keyword);
            var retEntity = _mapper.Map<IEnumerable<AppLogViewModel>>(list);
            return retEntity;
        }
        public async Task<AppLogViewModel> GetAppLogById(long logId)
        {
            var entity = await _appLogService.GetApplogById(logId);
            var retEntity = _mapper.Map<AppLogViewModel>(entity);
            //  var mapped = _mapper.Map<IEnumerable<PriceViewModel>>(list);
            return retEntity;
        }

        public async Task<IEnumerable<AppLogViewModel>> GetAppLogByUser(int userId)
        {
            var list = await _appLogService.GetAppLogByUserId(userId);
            var mapped = _mapper.Map<IEnumerable<AppLogViewModel>>(list);
            return mapped;
        }
        public async Task ProcessLoginActivity(int UserId, UTIL.LOGIN_ACTIVITY activity, string remoteMachineIp)
        {
            try
            {
                _logger.LogInformation("Login attempt from {0} IP is recorded");
                ApplogModel appLogModel = new ApplogModel();
                appLogModel.ActionType = (Byte)activity;
                appLogModel.LogTime = System.DateTime.Now;
                appLogModel.Dspid = GlobalSettings.DefaultDspId;
                appLogModel.LogDesc = activity == UTIL.LOGIN_ACTIVITY.LOGGED_OUT ? BlazorConstant.LOGGED_OUT_MSG : BlazorConstant.LOGGED_IN_MSG;
                appLogModel.MachineIp = remoteMachineIp;
                appLogModel.UserId = UserId;
                await _appLogService.Create(appLogModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }


        }
        public async Task CreateAppLog(AppLogViewModel AppLogViewModel)
        {
            var mapped = _mapper.Map<ApplogModel>(AppLogViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");
            await _appLogService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - AppLogPageService");
        }

        public async Task UpdateAppLog(AppLogViewModel appLogViewModel)
        {
            var mapped = _mapper.Map<ApplogModel>(appLogViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _appLogService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - AppLogPageService");
        }

        public async Task DeleteAppLog(AppLogViewModel appLogViewModel)
        {
            throw new Exception("Not implemented");
            //var mapped = _mapper.Map<AppLogModel>(appLogViewModel);
            //if (mapped == null)
            //    throw new Exception($"Entity could not be mapped.");

            //await _appLogService.Delete(mapped);
            //_logger.LogInformation($"Entity successfully added - AddressPageService");
        }
    }
}
