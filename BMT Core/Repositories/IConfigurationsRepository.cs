using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using com.blazor.dsps.core;
using com.blazor.dsps.core.repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.dsps.core.repositories
{
    public interface IConfigurationsRepository : IRepository<Configuration>
    {
        Task<IEnumerable<Configuration>> GetListByStatusAsync(int status);       
        Task<IEnumerable<Configuration>> GetListByNameAsync(string name);
        Task<Configuration> GetConfigurationByKeyAsync(string key);
        Task<IEnumerable<Configuration>> getConfigurationListAsyncByDSP(int DspId);
        Task<Configuration> GetConfigurationsByIdAsync(int configurationId);
        Task<Configuration> GetListByDspAndKeyAsync(int ShowRoomId, string key);

    }
}
