using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositories
{
    public interface IBasicConfigurationsRepository : IRepository<Basicconfiguration>
    {
        Task<IEnumerable<Basicconfiguration>> GetListByStatusAsync(int status);       
        Task<IEnumerable<Basicconfiguration>> GetListByNameAsync(string name);
        Task<Basicconfiguration> GetBasicConfigurationByKeyAsync(string key);
        Task<Basicconfiguration> GetBasicConfigurationsByIdAsync(int configurationId);
        Task<Basicconfiguration> GetListByDspAndKeyAsync( string key);

    }
}
