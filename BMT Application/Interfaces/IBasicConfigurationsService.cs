using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IBasicConfigurationsService
    {
        Task<IEnumerable<BasicConfigurationModel>> GetBasicConfigurstionsListByStatusAsync(int status);
     
        Task<IEnumerable<BasicConfigurationModel>> GetListByNameAsync(string details);
        Task<BasicConfigurationModel> GetBasicConfigurationByKeyAsync(string keyword);
        Task<BasicConfigurationModel> GetBasicConfigurstionByIdAsync(int id);
        Task<BasicConfigurationModel> GetBasicConfigurstionByKeyAndStoreAsync(int ShowRoomId, string key);
        Task<BasicConfigurationModel> Create(BasicConfigurationModel configurationsModel);
        Task Update(BasicConfigurationModel configurationsModel);


    }
}
