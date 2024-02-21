using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IConfigurationsService
    {
        Task<IEnumerable<ConfigurationModel>> GetConfigurstionsListByStatusAsync(int status);
     
        Task<IEnumerable<ConfigurationModel>> GetListByNameAsync(string details);
        Task<ConfigurationModel> GetConfigurationByKeyAsync(string keyword);
        Task<IEnumerable<ConfigurationModel>> GetConfigurationByDspAsync(int DspId);
        Task<ConfigurationModel> GetConfigurstionByKeyAndOrgAsync(int OrgId, string key);
        Task<ConfigurationModel> Create(ConfigurationModel configurationsModel);
        Task Update(ConfigurationModel configurationsModel);


    }
}
