using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IIntegrationService
    {
        Task<IEnumerable<IntegrationservicesettingModel>> GetIntegrationserviceListByStatusAsync(int status);     
        Task<IEnumerable<IntegrationservicesettingModel>> GetIntegrationserviceByNameAsync(string details);
        Task<IntegrationservicesettingModel> GetByIdAsync(Int32 id);
        Task<IEnumerable<IntegrationservicesettingModel>> GetIntegrationserviceAllFiltersAsync(IntegrationservicesettingModel model);
        Task<IntegrationservicesettingModel> Create(IntegrationservicesettingModel model);
        Task Update(IntegrationservicesettingModel model);
        Task Delete(IntegrationservicesettingModel model);

    }
}
