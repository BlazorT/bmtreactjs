using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IIntegrationRepository : IRepository<Integrationservicesetting>
    {
        Task<IEnumerable<Integrationservicesetting>> GetIntegrationserviceListByStatusAsync(int status);
        Task<IEnumerable<Integrationservicesetting>> GetIntegrationserviceByNameAsync(string name);
        Task<IEnumerable<Integrationservicesetting>> GetIntegrationserviceAllFiltersAsync(Integrationservicesetting model);
        Task<Integrationservicesetting> GetByIdAsync(Int32 id);


    }
}
