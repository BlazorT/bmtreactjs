using Blazor.Web.Application.Interfaces;
using Blazor.Web.Infrastructure.Services;
using Blazor.Web.Application.Models;
using Blazor.Web.UI.Interfaces;
using Blazor.Web.ViewModels;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.application.interfaces;

namespace Blazor.Web.UI.Services
{
    public class BlazorUtilPageService : IBlazorUtilPageService
    {
        private readonly IStatesService _stateService;
        private readonly ICitiesService _cityService;
        private readonly IConfigurationsService _configurationsService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;
        //private readonly ICategoryService _categoryAppService;
        private readonly IMapper _mapper;
        private readonly ILogger<BlazorUtilPageService> _logger;
        public BlazorUtilPageService(IStatesService stateService, IBlazorRepoPageService blazorRepoPageService, ICitiesService cityService, IConfigurationsService configurationsService, IMapper mapper, ILogger<BlazorUtilPageService> logger)
        {
            _stateService = stateService ?? throw new ArgumentNullException(nameof(stateService));
            _cityService = cityService ?? throw new ArgumentNullException(nameof(cityService));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _configurationsService = configurationsService ?? throw new ArgumentNullException(nameof(configurationsService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<StatesViewModel>> GetStatesByStatusList(int status) {
            var list = await _stateService.GetStatesByStatusList(status);
            var mappedList = _mapper.Map<IEnumerable<StatesViewModel>>(list);
            return mappedList;
        }
        public async Task<ConfigurationsViewModel> GetConfigurationsByKeyAsync(string key)
        {
            var list = await _configurationsService.GetConfigurationByKeyAsync(key);
            var mappedList = _mapper.Map<ConfigurationsViewModel>(list);
            return mappedList;
        }
        public async Task<IEnumerable<ConfigurationsViewModel>> GetConfigurationsByStatusAsync(int status)
        {
            var list = await _configurationsService.GetConfigurstionsListByStatusAsync(status);
            var mappedList = _mapper.Map<IEnumerable<ConfigurationsViewModel>>(list);
            return mappedList;
        }
        public List<CityViewModel> getGridData()
        {
            // var list = await _configurationsService.GetConfigurstionsListByStatusAsync(status);
            List<CityViewModel> items = new List<CityViewModel>();
            items.Add(new CityViewModel { Id = 1, Name = "Lahore", StateId = 1, Description = "Yesy 1" });
            items.Add(new CityViewModel { Id = 2, Name = "Faisal Abad", StateId = 1, Description = "Collection" });
            return items;
        }
        public async Task<IEnumerable<ConfigrationsCombinedViewModel>> LoadOrgConfigurationsData(int showRoomId){
           // var configurationls = await _blazorRepoPageService.LoadOrgConfigurationsData(showRoomId);
            List<ConfigrationsCombinedViewModel> ccvm = new List<ConfigrationsCombinedViewModel>();

            return ccvm;
        }
        //public async Task<ConfigrationsCombinedViewModel> loadSettingsAndConfigurations()
        //{
        //   var configurationls = await _blazorRepoPageService.LoadBasicConfigurationsData();
        //    ConfigrationsCombinedViewModel ccvm = new ConfigrationsCombinedViewModel();
        
        //    return ccvm;
        //}
        public async Task<ConfigrationsCombinedViewModel> UpdateConfigurationChangeSet(int UserId,ConfigrationsCombinedViewModel config)
        {
          //  var list = await _configurationsService.GetConfigurstionsListByStatusAsync((int)UTIL.COMMON_STATUS.ACTIVE);
          //  var mappedList = _mapper.Map<IEnumerable<ConfigrationsViewModel>>(list);
          //  ConfigrationsCombinedViewModel ccvm = new ConfigrationsCombinedViewModel();

            

            //  if (config.stmppwd.Trim() != UTIL.Configurations.stmppwd)
            //    {
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.SMTP_PWD);
            //    configurationsModel.Key = UTIL.BlazorConstants.SMTP_PWD;
            //    configurationsModel.Value = config.stmppwd.Trim();
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //    }
            //if (config.smtpport.Trim() != UTIL.Configurations.smtpport)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.SMTP_PORT);
            //    configurationsModel.Key = UTIL.BlazorConstants.SMTP_PORT;
            //    configurationsModel.Value = config.smtpport.Trim();             
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}

            //if (config.stmpserver.Trim() != UTIL.Configurations.stmpserver)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.SMTP_SERVER);
            //    configurationsModel.Key = UTIL.BlazorConstants.SMTP_SERVER;
            //    configurationsModel.Value = config.stmpserver.Trim();
            
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}
            //if (config.ftpVideoLibraryPath.Trim() != UTIL.Configurations.ftpVideoLibraryPath)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.FTP_VIDEO_LIBRARY_PATH);
            //    configurationsModel.Key = UTIL.BlazorConstants.FTP_VIDEO_LIBRARY_PATH;
            //    configurationsModel.Value = config.ftpVideoLibraryPath.Trim();               
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}
            //if (config.enableEmailNotification != UTIL.Configurations.enableEmailNotification)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.ENABLE_EMAIL);
            //    configurationsModel.Key = UTIL.BlazorConstants.ENABLE_EMAIL;
            //    configurationsModel.Value = Convert.ToInt32(config.enableEmailNotification).ToString();           
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}
            //if (config.invitationEmailBody != UTIL.Configurations.invitationEmailBody)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.EMAIL_EMAIL_BODY);
            //    configurationsModel.Key = UTIL.BlazorConstants.EMAIL_EMAIL_BODY;
            //    configurationsModel.Value = config.invitationEmailBody;                
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}
            //if (config.stmpuser != UTIL.Configurations.stmpuser)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.SMTP_USER);
            //    configurationsModel.Key = UTIL.BlazorConstants.SMTP_USER;
            //    configurationsModel.Value = config.stmpuser;               
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}

            //if (config.invitationEmailSubject != UTIL.Configurations.invitationEmailSubject)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.EMAIL_SUBJECT);
            //    configurationsModel.Key = UTIL.BlazorConstants.EMAIL_SUBJECT;
            //    configurationsModel.Value = config.invitationEmailSubject;
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}

            //if (config.tax != UTIL.Configurations.tax)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.TAX);
            //    configurationsModel.Key = UTIL.BlazorConstants.TAX;
            //    configurationsModel.Value = Math.Round(Convert.ToDouble(config.tax),2).ToString();
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}
            //if (config.ftpUser != UTIL.Configurations.ftpUser)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.FTP_USER);
            //    configurationsModel.Key = UTIL.BlazorConstants.FTP_USER;
            //    configurationsModel.Value = config.ftpUser.Trim();
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}
            //if (config.ftpServer != UTIL.Configurations.FTPServer)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.FTP_SERVER);
            //    configurationsModel.Key = UTIL.BlazorConstants.FTP_SERVER;
            //    configurationsModel.Value = config.ftpServer.Trim();
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}
            //if (config.ftpPwd != UTIL.Configurations.ftpPwd)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.FTP_PWD);
            //    configurationsModel.Key = UTIL.BlazorConstants.FTP_PWD;
            //    configurationsModel.Value = config.ftpPwd.Trim();
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}
            //if (config.fTPPort != UTIL.Configurations.FTPPort)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.FTP_PORT);
            //    configurationsModel.Key = UTIL.BlazorConstants.FTP_PORT;
            //    configurationsModel.Value = config.fTPPort.Trim();
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //  //  await _configurationsService.Update(configurationsModel);
            //}
            //if (config.ftpServerURI != UTIL.Configurations.ftpServerURI)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.FTP_URI);
            //    configurationsModel.Key = UTIL.BlazorConstants.FTP_URI;
            //    configurationsModel.Value = config.ftpServerURI.Trim();
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}
            //if (config.ftpUploadPath != UTIL.Configurations.ftpUploadPath)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.FTP_UPLOAD_PATH);
            //    configurationsModel.Key = UTIL.BlazorConstants.FTP_UPLOAD_PATH;
            //    configurationsModel.Value = config.ftpUploadPath.Trim();
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}
            //if (config.ftpSSLEnabled != UTIL.Configurations.ftpSSLEnabled)
            //{
            //    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.FTP_SSL_ENABLED);
            //    configurationsModel.Key = UTIL.BlazorConstants.FTP_SSL_ENABLED;
            //    configurationsModel.Value = Convert.ToInt32(config.ftpSSLEnabled).ToString();
            //    configurationsModel.LastUpdatedAt = UTIL.GlobalApp.CurrentDateTime;
            //    configurationsModel.LastUpdatedBy = UserId;
            //    configurationsModel.RowVer = configurationsModel.RowVer + 1;
            //    await _configurationsService.Update(configurationsModel);
            //}
            ////if (config.ftpPwd != UTIL.Configurations.ftpPwd)
            ////{
            ////    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.FTP_PWD);
            ////    configurationsModel.Key = UTIL.BlazorConstants.FTP_PWD;
            ////    configurationsModel.Value = Math.Round(Convert.ToDouble(config.tax),2).ToString();
            ////    await _configurationsService.Update(configurationsModel);
            ////}
            ////if (config.ftpServer != UTIL.Configurations.FTPServer)
            ////{
            ////    ConfigurationsModel configurationsModel = await _configurationsService.GetConfigurationByKeyAsync(UTIL.BlazorConstants.FTP_SERVER);
            ////    configurationsModel.Key = UTIL.BlazorConstants.FTP_SERVER;
            ////    configurationsModel.Value = Math.Round(Convert.ToDouble(config.tax), 2).ToString();
            ////    await _configurationsService.Update(configurationsModel);
            ////}

            return config;
        }
        public async Task<IEnumerable<StatesViewModel>> GetStatesList(string  keyword)
        {
            var list = await _stateService.GetStatesList(keyword);
            var mappedList = _mapper.Map<IEnumerable<StatesViewModel>>(list);
            return mappedList;
        }
        public async Task<IEnumerable<CityViewModel>> GetCitesByStatusList(int status)
        {
            var list = await _cityService.GetCitiesByStatusList(status);
            var mappedList = _mapper.Map<IEnumerable<CityViewModel>>(list);
            return mappedList;
        }
        public async Task<IEnumerable<CityViewModel>> GetCitesList(string keyword)
        {
            var list = await _cityService.GetCitiesList(keyword);
            var mappedList = _mapper.Map<IEnumerable<CityViewModel>>(list);
            return mappedList;
        }
        public async Task<IEnumerable<CityViewModel>> GetCitesByStateList(int stateId)
        {
            try
            {
                var list = await _cityService.GetCitiesListByState(stateId);
                var mappedList = _mapper.Map<IEnumerable<CityViewModel>>(list);
                return mappedList;
            }
            catch (Exception ex) {
                return null;
            }
        }
        
        //public async Task<Boolean> SendResendEmailNotificationAsync(string email, int roleId, string tokenURI, string uri)
        //{
        //    Boolean sentStatus = false;
        //    try
        //    {
        //        EmailSender EmailSender = new EmailSender();
        //        if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer) )
        //            loadSettingsAndConfigurations();
        //        if (roleId == (int)USERROLES.SUPERADMIN || roleId == (int)USERROLES.STAFF )
        //            await EmailSender.SendResendMerchantEmailNotificationAsync(email, string.Format(UTIL.Configurations.invitationEmailSubject, tokenURI, uri), "REMINDER");
        //        else if(roleId == (int)USERROLES.SUPERVISOR)
        //            await EmailSender.SendResendMerchantEmailNotificationAsync(email, string.Format(UTIL.Configurations.InvitationEmailBody, tokenURI, uri),"REMINDER");
        //        else 
        //            await EmailSender.SendResendMerchantEmailNotificationAsync(email, string.Format(UTIL.Configurations.invitationEmailSubject, tokenURI, uri), "REMINDER");

        //        _logger.LogInformation("Email has been sent to " + email);
        //        sentStatus = true;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError("Failed to send email, Error - " + ex.Message);
        //        throw ex;               
        //    }
        //    return sentStatus;
        //}
        public async Task sendInvitationEmailNotfification(string recipientId, string tokenURI, string uri, USERROLES uRole)
        {
            try
            {
                EmailSender EmailSender = new EmailSender();
                if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
                    GlobalUTIL.loadConfigurations(1);
                if (uRole == USERROLES.SUPERADMIN || uRole == USERROLES.STAFF)
                    await EmailSender.SendEmailNotificationAsync(recipientId, tokenURI, uri);
                else if (uRole == USERROLES.SUPERVISOR)
                    await EmailSender.SendMerchantEmailNotificationAsync(recipientId, tokenURI, uri);

                _logger.LogInformation("Email has been sent to " + recipientId);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to send email, Error - " + ex.Message);
                throw ex;
            }

        }
        public async Task accountStatusChangeEmailNotification(string recipientId, int status, string remarks)
        {
            try
            {
                EmailSender EmailSender = new EmailSender();
                if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpUser) || !GlobalBasicConfigurationsViewModel.SmtpUser.Contains("@@"))
                    GlobalUTIL.loadConfigurations(1);
                await EmailSender.SendAccountStatusChangeEmailNotificationAsync(recipientId, remarks);              

                _logger.LogInformation("Email has been sent to " + recipientId);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to send email, Error - " + ex.Message);
                throw ex;
            }

        }
        public async Task merchantVideoStatusChangeEmailNotification(string recipientEmailId, int status, string remarks)
        {
            try
            {
                EmailSender EmailSender = new EmailSender();
                if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer) )
                    GlobalUTIL.loadConfigurations(1);
                await EmailSender.MerchantVideoStatusChangeEmailNotificationAsync(recipientEmailId, status,remarks);

                _logger.LogInformation("Email has been sent to " + recipientEmailId);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to send email, Error - " + ex.Message);
                throw ex;
            }

        }
        public async Task sendForgotPasswordEmailNotfification(string recipientId, string urlWithToken, string uri)
        {
            try
            {
                EmailSender EmailSender = new EmailSender();
                if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer) )
                     GlobalUTIL.loadConfigurations(1); ;
                await EmailSender.SendResetEmailNotificationAsync(recipientId, urlWithToken, uri);
                _logger.LogInformation("Password reset request initialized from " + recipientId);
            }
            catch (Exception ex)
            {
                _logger.LogError("Reset Password Initialization failed, Error - " + ex.Message);
                throw ex;
            }

        }
    }
}
