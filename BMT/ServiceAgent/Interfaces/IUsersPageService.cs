using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;
namespace Blazor.Web.UI.Interfaces
{
    public interface IUsersPageService
    {
        Task<IEnumerable<UserViewModel>> GetUsers(string detail);
        Task<IEnumerable<UserViewModel>> GetUsers();
        Task<IEnumerable<EnumViewModel>> GetUsersKeyValueCollection(USERROLES userRole);
        Task<IEnumerable<EnumViewModel>> GetUsersKeyValueCollectionMerchants(int schoolId, USERROLES userRole);
        Task<UserViewModel> GetUserById(int userId);
        Task<IEnumerable<UserViewModel>> GetUsersByRole(USERROLES role);
        Task<IEnumerable<UserViewModel>> GetUsersBySearchFiltersAsync(int roleId, string name, int status, DateTime dtFrom, DateTime dtTo);
      //  Task<IEnumerable<UsersViewModel>> GetMerchantsBySearchFiltersAsync(int userId, int schoolId, int categoryId, string name, int status, DateTime dtFrom, DateTime dtTo);
        Task<IEnumerable<UserViewModel>> GetUsersAllDetailList(int userId,int roleId, string name, int status, DateTime? dtFrom, DateTime? dtTo);
        Task<BlazorResponseViewModel> forgotPassword(string email, string token, string pwd);
        Task<BlazorResponseViewModel> changePassword(Int32 UserId, string pwd);
        Task<UserViewModel> GetUserByEmailSync(int roleId, string email);
        Task<UserViewModel> CreateUser(UserViewModel UsersViewModel);
        Task UpdateUser(UserViewModel UsersViewModel);
        Task<UserViewModel> GetUserByEmailOrLoginNameAsynch(string emailOrLogin, string securityCode);

        Task DeleteUser(UserViewModel UsersViewModel);
    }
}
