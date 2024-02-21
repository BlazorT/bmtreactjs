using com.blazor.bmt.core.repositries;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositories
{
    public interface IAddressRepository : IRepository<Address>
    {
        Task<IEnumerable<Address>> GetAddressListAsync();       
        Task<IEnumerable<Address>> GetAddressByNameAsync(string name);
        Task<IEnumerable<Address>> GetAddressByUserAsync(int userId);
    }
}
