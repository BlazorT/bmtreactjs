using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IPackageRepository :IRepository<Package>
    {
        Task<IEnumerable<Package>> GetPackagesListByStatusAsync(int status);
        Task<Package> GetPackageListByIdAsync(int id);
        Task<IEnumerable<Package>> GetPackagesByNameAsync(string name);
        
    }
}
