
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.dsps.core.repositories
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
