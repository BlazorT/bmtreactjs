using com.blazor.bmt.application.model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IPackageService
    {
        Task<IEnumerable<PackageModel>> GetPackagesByStatusList(int status);
        Task<PackageModel> GetPackageByIdAsync(int Id);
        Task<IEnumerable<PackageModel>> GetPackagesList(string details);
        Task<PackageModel> Update(PackageModel model);

    }
}
