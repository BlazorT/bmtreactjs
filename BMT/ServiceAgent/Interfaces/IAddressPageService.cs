
using com.blazor.bmt.viewmodels;
namespace Blazor.Web.UI.Interfaces
{
    public interface IAddressPageService
    {
        Task<IEnumerable<AddressViewModel>> GetAddress(string detail);
        Task<IEnumerable<AddressViewModel>> GetAddress();
        Task<AddressViewModel> GetAddressById(int AddressId);
        Task<IEnumerable<AddressViewModel>> GetAddressByName(int userId);       
        Task<AddressViewModel> CreateAddress(AddressViewModel AddressViewModel);
        Task UpdateAddress(AddressViewModel AddressViewModel);
        Task DeleteAddress(AddressViewModel AddressViewModel);
    }
}
