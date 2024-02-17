using com.blazor.bmt.viewmodels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.ui.interfaces
{
    public interface IBlazorUtilPageService
    {
        Task<IEnumerable<StatesViewModel>> GetStatesByStatusList(int status);
     
        Task<IEnumerable<StatesViewModel>> GetStatesList(string details);
        //Task<IEnumerable<CitiesViewModel>> GetCitesByStatusList(int status);

        //Task<IEnumerable<CitiesViewModel>> GetCitesList(string details);
        //Task<IEnumerable<CitiesViewModel>> GetCitesByStateList(int stateId);

        //Task<IEnumerable<ConfigurationsViewModel>> GetConfigurationsByStatusAsync(int status);


        //Task<ConfigrationsCombinedViewModel> loadSettingsAndConfigurations();
        Task<ConfigurationsViewModel> UpdateConfigurationChangeSet(int dspId, ConfigurationsViewModel config);

        //Task<Boolean> SendResendEmailNotificationAsync(string email, int roleId, string tokenURI, string uri);
        //Task accountStatusChangeEmailNotification(string recipientId, int status, string remarks);
        //Task VehicleStatusChangeEmailNotification(List<string> recipientEmailId, int status, string remarks);
        
       // Task VehiclePlaceOfferNotificationAsync(int ShowRoomId, string recipientId,string offerAmount, string infoOrTitle = "");
        Task SendRegistrationEmailNotificationAsync(int ShowRoomId, string recipientId, string emailTitle = "");
        //Task InspectionRequestEmailNotificationAsync(int ShowRoomId, string recipientId,string customerName, string vehicleDesc = "");
        //Task InspectionReportEmailNotificationAsync(int ShowRoomId, string recipientId, string vehicleDesc = "");
        Task VehicleUploadEmailNotificationAsync(int ShowRoomId, string recipientId, string vehicleDesc = "");
      //  Task PostFlagEmailNotificationAsync(int ShowRoomId, string recipientId, int status, string emailDesc = "");
        //Task PlaceVehicleOfferAsync(VehicleOfferViewModel oModel);
        Task sendForgotPasswordEmailNotfification(int ShowRoomId, string email, int roleId, string tokenURI, string uri, string title);
        Task<Boolean> SendResendEmailNotificationAsync(int ShowRoomId, string email, int roleId, string tokenURI, string uri);
        Task accountStatusChangeEmailNotification(int ShowRoomId, string recipientId, int status, string remarks);
       // Task VehicleStatusChangeEmailNotification(int ShowRoomId, List<string> recipients, int status, string remarks);
        Task VehicleInfoShareViewEmailNotification(int ShowRoomId, List<string> recipients, string vehicleDesc);
        Task GenerateTestSMTPSettings(BasicConfigurationViewModel bcvm);

    }
}
