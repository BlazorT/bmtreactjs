
using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;
namespace Blazor.Web.UI.Interfaces
{
    public interface IBlazorUtilPageService
    {
        Task<IEnumerable<StatesViewModel>> GetStatesByStatusList(int status);
     
        Task<IEnumerable<StatesViewModel>> GetStatesList(string details);
        Task<IEnumerable<CityViewModel>> GetCitesByStatusList(int status);

        Task<IEnumerable<CityViewModel>> GetCitesList(string details);
        Task<IEnumerable<CityViewModel>> GetCitesByStateList(int stateId);

        Task<IEnumerable<ConfigurationsViewModel>> GetConfigurationsByStatusAsync(int status);
        Task<IEnumerable<ConfigrationsCombinedViewModel>> LoadOrgConfigurationsData(int showRoomId);
        //Task<ConfigrationsCombinedViewModel> loadSettingsAndConfigurations();
        Task<ConfigrationsMergedViewModel> UpdateConfigurationChangeSet(int UserId, ConfigrationsMergedViewModel config);
       
        Task<ConfigurationsViewModel> GetConfigurationsByKeyAsync(string key);
        Task sendInvitationEmailNotfification(string recipientId, string tokenURI, string uri, USERROLES uRole);
        Task sendForgotPasswordEmailNotfification(string recipientId, string urlWithToken, string uri);
       // Task<Boolean> SendResendMerchantEmailNotificationAsync(string email, int roleId, string tokenURI, string uri);
        Task accountStatusChangeEmailNotification(string recipientId, int status, string remarks);
        Task merchantVideoStatusChangeEmailNotification(string recipientEmailId, int status, string remarks);





    }
}
