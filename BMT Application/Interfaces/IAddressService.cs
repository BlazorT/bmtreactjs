using Blazor.Web.Application.Models;
using com.blazor.bmt.application.model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IAddressService
    {
        Task<IEnumerable<AddressModel>> GetAddressList();
        Task<AddressModel> GetAddressById(int userId);
        Task<IEnumerable<AddressModel>> GetAddressList(string details);
        Task<IEnumerable<AddressModel>> GetAddressByName(int userId);
        Task<AddressModel> Create(AddressModel addressModel);
        Task Update(AddressModel addressModel);
        Task Delete(AddressModel addressModel);
    }
}
