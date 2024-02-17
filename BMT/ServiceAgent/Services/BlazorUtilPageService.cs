using Blazor.Web.Infrastructure.Services;
using AutoMapper;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.application.model;

namespace com.blazor.bmt.ui.services
{
    public class BlazorUtilPageService : IBlazorUtilPageService
    {
        private readonly IStatesService _stateService;
        //private readonly ICitiesService _cityService;
        private readonly IConfigurationsService _configurationsService;
        //private readonly IVehicleOfferService _vehicleOfferService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;
        //private readonly ICategoryService _categoryAppService;
        private readonly IMapper _mapper;
        private readonly ILogger<BlazorUtilPageService> _logger;
        public BlazorUtilPageService(IStatesService stateService,   IBlazorRepoPageService blazorRepoPageService, IConfigurationsService configurationsService, IMapper mapper, ILogger<BlazorUtilPageService> logger)
        {
            _stateService = stateService ?? throw new ArgumentNullException(nameof(stateService));
           // _cityService = cityService ?? throw new ArgumentNullException(nameof(cityService));
           // _vehicleOfferService = vehicleOfferService ?? throw new ArgumentNullException(nameof(vehicleOfferService));
            _blazorRepoPageService = blazorRepoPageService ?? throw new ArgumentNullException(nameof(blazorRepoPageService));
            _configurationsService = configurationsService ?? throw new ArgumentNullException(nameof(configurationsService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }       
        public async Task<IEnumerable<StatesViewModel>> GetStatesByStatusList(int status)
        {
            var list = await _stateService.GetStatesByStatusList(status);
            var mappedList = _mapper.Map<IEnumerable<StatesViewModel>>(list);
            return mappedList;
        }
        public async Task<IEnumerable<StatesViewModel>> GetUserByIdAsnyc(int id)
        {
            //var list = await _blazorRepoPageService.GetUserByIdAsync(id);
            //var mappedList = _mapper.Map<IEnumerable<StatesViewModel>>(list);
            return null;
        }
        public async Task<IEnumerable<StatesViewModel>> GetStatesList(string keyword)
        {
            var list = await _stateService.GetStatesList(keyword);
            var mappedList = _mapper.Map<IEnumerable<StatesViewModel>>(list);
            return mappedList;
        }       
        public async Task<ConfigurationsViewModel> UpdateConfigurationChangeSet(int dspId, ConfigurationsViewModel config)
        {
            ConfigurationsViewModel dbModel = new ConfigurationsViewModel();
            dbModel = GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault();                
            if (config.enableEmailNotification != dbModel.enableEmailNotification)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.ENABLE_EMAIL_NOTIFICATION);
                configurationsModel.Key = BlazorConstant.ENABLE_EMAIL_NOTIFICATION;
                configurationsModel.Value = Convert.ToInt32(config.enableEmailNotification).ToString();
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;     
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (config.enableAppNotification != dbModel.enableAppNotification) {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.ENABLE_APP_NOTIFICATION);
                configurationsModel.Key = BlazorConstant.ENABLE_APP_NOTIFICATION;
                configurationsModel.Value = Convert.ToInt32(config.enableAppNotification).ToString();
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;         
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            } 
            if ( config.enableSMS != dbModel.enableSMS) {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.SMS_ENABLE);
                configurationsModel.Key = BlazorConstant.SMS_ENABLE;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.Value = "" + config.enableSMS;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;        
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (!string.IsNullOrWhiteSpace(config.SMS_MESSAGE_TEMPLATE) && config.SMS_MESSAGE_TEMPLATE != dbModel.SMS_MESSAGE_TEMPLATE) {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.SMS_MESSAGE_TEMPLATE);
                configurationsModel.Key = BlazorConstant.SMS_MESSAGE_TEMPLATE;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.Value = "" + config.SMS_MESSAGE_TEMPLATE;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;    
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (!string.IsNullOrWhiteSpace(config.invitationEmailBody) && config.invitationEmailBody != dbModel.invitationEmailBody)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.INVITATION_EMAIL_BODY);
                configurationsModel.Key = BlazorConstant.INVITATION_EMAIL_BODY;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.Value = "" + config.invitationEmailBody;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;            
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (!string.IsNullOrWhiteSpace(config.OffboardedEmailBody) && config.OffboardedEmailBody != dbModel.OffboardedEmailBody)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.OFFGROUND_EMAIL_BODY);
                configurationsModel.Key = BlazorConstant.OFFGROUND_EMAIL_BODY;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.Value = "" + config.OffboardedEmailBody;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;             
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (!string.IsNullOrWhiteSpace(config.OnBoardedEmaillBody) && config.OnBoardedEmaillBody != dbModel.OnBoardedEmaillBody)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.ONBOARDING_EMAIL_BODY);
                configurationsModel.Key = BlazorConstant.ONBOARDING_EMAIL_BODY;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.Value = "" + config.OnBoardedEmaillBody;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;         
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (!string.IsNullOrWhiteSpace(config.DrugCheckEmaillBody) && config.DrugCheckEmaillBody != dbModel.DrugCheckEmaillBody)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.DRUG_CHECK_EMAIL);
                configurationsModel.Key = BlazorConstant.DRUG_CHECK_EMAIL;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.Value = "" + config.DrugCheckEmaillBody;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;        
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (!string.IsNullOrWhiteSpace(config.BackgroundCheckEmaillBody) && config.BackgroundCheckEmaillBody != dbModel.BackgroundCheckEmaillBody)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.BACKGROUND_CHECK_EMAIL);
                configurationsModel.Key = BlazorConstant.BACKGROUND_CHECK_EMAIL;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.Value = "" + config.BackgroundCheckEmaillBody;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;        
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (!string.IsNullOrWhiteSpace(config.DAJObApplyProcessUpdated) && config.DAJObApplyProcessUpdated != dbModel.DAJObApplyProcessUpdated)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.DA_JOB_PROCESS_UPDATED);
                configurationsModel.Key = BlazorConstant.DA_JOB_PROCESS_UPDATED;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.Value = "" + config.DAJObApplyProcessUpdated;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;       
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (!string.IsNullOrWhiteSpace(config.DAPerformanceNotification) && config.DAPerformanceNotification != dbModel.DAPerformanceNotification)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.DA_PERFORMACE_NOTIFICATION);
                configurationsModel.Key = BlazorConstant.DA_PERFORMACE_NOTIFICATION;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.Value = "" + config.DAPerformanceNotification;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;       
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (!string.IsNullOrWhiteSpace(config.DSPPerformanceNotification) && config.DSPPerformanceNotification != dbModel.DSPPerformanceNotification)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.DSP_PERFORMACE_NOTIFICATION);
                configurationsModel.Key = BlazorConstant.DSP_PERFORMACE_NOTIFICATION;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.Value = "" + config.DSPPerformanceNotification;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;            
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (!string.IsNullOrWhiteSpace(config.AccountDeletedEmailBody) && config.AccountDeletedEmailBody != dbModel.AccountDeletedEmailBody)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.ACCOUNT_DELETED_EMAIL_BODY);
                configurationsModel.Key = BlazorConstant.ACCOUNT_DELETED_EMAIL_BODY;
                configurationsModel.Value = "" + config.AccountDeletedEmailBody;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;
                if(configurationsModel.id> 0)
                await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (!string.IsNullOrWhiteSpace(config.AccountStatusChangedEmailBody) && config.AccountStatusChangedEmailBody != dbModel.AccountStatusChangedEmailBody)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.ACCOUNT_STATUS_CHANGED_EMAIL_BODY);
                configurationsModel.Key = BlazorConstant.ACCOUNT_STATUS_CHANGED_EMAIL_BODY;
                configurationsModel.Value = "" + config.AccountStatusChangedEmailBody;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;          
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            if (!string.IsNullOrWhiteSpace(config.profilePwdResetEmail) && config.profilePwdResetEmail != dbModel.profilePwdResetEmail)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.ACCOUNT_PASSWORD_RESET_EMAIL_BODY);
                configurationsModel.Key = BlazorConstant.ACCOUNT_PASSWORD_RESET_EMAIL_BODY;
                configurationsModel.Value = "" + config.profilePwdResetEmail;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;            
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }           
            if (config.enableSMS != dbModel.enableSMS)
            {
                ConfigurationModel configurationsModel = await _configurationsService.GetConfigurstionByKeyAndDspeAsync(dspId, BlazorConstant.SMS_ENABLE);
                configurationsModel.Key = BlazorConstant.SMS_ENABLE;
                configurationsModel.Value = Convert.ToInt32(config.enableSMS).ToString();
                configurationsModel.LastUpdatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.Name = configurationsModel.Key;
                configurationsModel.Description = configurationsModel.Key;
                configurationsModel.Dspid = dspId;
                configurationsModel.LastUpdatedBy = config.LastUpdatedBy;
                configurationsModel.Status = (int)UTIL.COMMON_STATUS.ACTIVE;
                configurationsModel.CreatedAt = GlobalUTIL.CurrentDateTime;
                configurationsModel.CreatedBy = config.LastUpdatedBy;
                // configurationsModel.RowVer = configurationsModel.RowVer + 1;
                if (configurationsModel.id > 0)
                    await _configurationsService.Update(configurationsModel);
                else
                    await _configurationsService.Create(configurationsModel);
            }
            
            return config;
        }
       
        public async Task SendRegistrationEmailNotificationAsync(int DspId,string recipientId, string emailTitle = "")
        {
            try
            {
                EmailSender EmailSender = new EmailSender();
                if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpUser) || string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
                     GlobalUTIL.loadConfigurations(DspId); 
                await EmailSender.SendRegistrationEmailNotificationAsync(DspId, recipientId, emailTitle);
                _logger.LogInformation("User Registration email has been sent to " + recipientId);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to send email, Error - " + ex.Message);
                throw ex;
            }
        }
        public async Task VehicleUploadEmailNotificationAsync(int ShowRoomId, string recipientId, string vehicleDesc = "")
        {
            try
            {
                EmailSender EmailSender = new EmailSender();
                if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpUser) || string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
                    GlobalUTIL.loadConfigurations();
                await EmailSender.SendVehicleUploadEmailNotificationAsync(ShowRoomId,recipientId, vehicleDesc);
                _logger.LogInformation("User Registration email has been sent to " + recipientId);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to send email, Error - " + ex.Message);
                throw ex;
            }
        }
        
        public async Task GenerateTestSMTPSettings(BasicConfigurationViewModel bcvm)
        {
            try
            {
                EmailSender EmailSender = new EmailSender();
                //if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpUser) || string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
                //    GlobalUTIL.loadConfigurations();
                await EmailSender.GenerateTestSMTPSettings(bcvm);
                _logger.LogInformation("User registration email has been sent to " + bcvm.SmtpSenderEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to send email, Error - " + ex.Message);
                throw ex;
            }
        }
        //public async Task PostFlagEmailNotificationAsync(int showRoomId,string recipientId, int status,string emailDesc = "")
        //{
        //    try
        //    {
        //        EmailSender EmailSender = new EmailSender();
        //        if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpUser) || string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
        //            GlobalUTIL.loadConfigurations();
        //        await EmailSender.SendEmailFlagVehicleAsync(showRoomId,recipientId, emailDesc, status);
        //        _logger.LogInformation("Vehicle Flag email has been sent to " + recipientId);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError("Failed to send email, Error - " + ex.Message);
        //        throw ex;
        //    }
        //}
        public async Task sendForgotPasswordEmailNotfification(int ShowRoomId,string email, int roleId, string tokenURI, string uri, string title)
        {
            try
            {
                EmailSender EmailSender = new EmailSender();
                if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpUser) || string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
                    GlobalUTIL.loadConfigurations();
                await EmailSender.SendResetEmailNotificationAsync(ShowRoomId,email, uri, tokenURI, title);
                _logger.LogInformation("User Registeration email has been sent to " + email);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to send email, Error - " + ex.Message);
                throw ex;
            }
        }
        public async Task<Boolean> SendResendEmailNotificationAsync(int ShowRoomId,string email, int roleId, string tokenURI, string uri)
        {
            Boolean status = false;
            try
            {
                EmailSender EmailSender = new EmailSender();
                if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpUser) || string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
                    GlobalUTIL.loadConfigurations();
                await EmailSender.SendResetEmailNotificationAsync(ShowRoomId,email, uri, tokenURI, "Account resetting");
                _logger.LogInformation("User registeration email has been sent to " + email);
                status = true;
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to send email, Error - " + ex.Message);
                throw ex;
            }
            return status;
        }
        public async Task accountStatusChangeEmailNotification(int ShowRoomId, string recipientId, int status, string remarks)
        {
            try
            {
                EmailSender EmailSender = new EmailSender();
                if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpUser) || string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
                    GlobalUTIL.loadConfigurations();
                await EmailSender.SubscriptionStatusChangeEmailNotificationAsync(ShowRoomId,recipientId, status, remarks);
                _logger.LogInformation("User Registration email has been sent to " + recipientId);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to send email, Error - " + ex.Message);
                throw ex;
            }
        }
        //public async Task VehiclePlaceOfferNotificationAsync(int ShowRoomId,string recipientemail, string offerAmount, string infoOrTitle = "") { 
        //    try
        //    {
        //        EmailSender EmailSender = new EmailSender();
        //        if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpUser) || string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
        //            GlobalUTIL.loadConfigurations(Convert.ToInt32(GlobalBasicConfigurationsViewModel.DefaultDspid));///UTIL.GlobalSettings.ShowRoomId);
        //        await EmailSender.VehiclePlaceOfferNotificationAsync(ShowRoomId,recipientemail, offerAmount, infoOrTitle);
        //        _logger.LogInformation("User Registration email has been sent to " + recipientemail);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError("Failed to send email, Error - " + ex.Message);
        //        throw ex;
        //    }
        //}
        //public async Task VehicleStatusChangeEmailNotification(int ShowRoomId,List<string> recipients, int status, string remarks) {
        //    try
        //    {
        //        EmailSender EmailSender = new EmailSender();
        //        if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpUser) || string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
        //            GlobalUTIL.loadConfigurations(Convert.ToInt32(GlobalBasicConfigurationsViewModel.DefaultDspid));
        //        await EmailSender.VehicleStatusChangeEmailNotificationAsync(ShowRoomId,recipients.ToArray(), status, remarks);
        //        _logger.LogInformation("User Registration email has been sent to " + recipients.FirstOrDefault());
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError("Failed to send email, Error - " + ex.Message);
        //        throw ex;
        //    }
        //}
        public async Task VehicleInfoShareViewEmailNotification(int dspId,List<string> recipients, string vehicleDesc) {

            try
            {
                EmailSender EmailSender = new EmailSender();
                if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpUser) || string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
                    GlobalUTIL.loadConfigurations();
                await EmailSender.VehicleInfoSharingEmailNotificationAsync(dspId, recipients, vehicleDesc);
                _logger.LogInformation("User Registration email has been sent to " + recipients.FirstOrDefault());
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to send email, Error - " + ex.Message);
                throw ex;
            }
        }
    }
}
