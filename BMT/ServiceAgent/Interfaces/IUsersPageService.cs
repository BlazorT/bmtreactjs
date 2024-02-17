using com.blazor.bmt.viewmodels;
namespace com.blazor.bmt.ui.interfaces
{
        public interface IUsersPageService
    {
        Task<IEnumerable<UserViewModel>> GetUsersListAsync(int dspId, int roleId, string name);
        Task<IEnumerable<UserViewModel>> GetUsersListAsync(int dspId, int roleId);
        //Task<IEnumerable<ProductViewModel>> GetProductList(string productName);
        Task<UserViewModel> GetUserById(int id);
        Task<IEnumerable<UserViewModel>> GetUsersByDspAndRole(int dspId, int roleId);
        Task<IEnumerable<UserViewModel>> GetUserByByEmail(string email, string username);
        // Task<IEnumerable<CategoryViewModel>> GetCategories();
        Task<IEnumerable<UserViewModel>> GetUsersListAllAsync(UserViewModel uvm);
        Task<IEnumerable<UserViewModel>> GetDspUsersListAllAsync(UserViewModel uvm);
        Task<IEnumerable<UserViewModel>> GetDspMobileUsersListAllAsync(UserViewModel uvm);
        Task<BlazorResponseViewModel> forgotPassword(string email, string token, string pwd);
        Task<BlazorResponseViewModel> changePassword(Int32 UserId, string pwd);
        Task<UserViewModel> Create(UserViewModel vModel);
        Task Update(UserViewModel viewmodel);
        Task Delete(UserViewModel viewmodel);
    }
    }

