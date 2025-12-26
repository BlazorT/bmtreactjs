using com.blazor.bmt.application.model;
using com.blazor.bmt.util;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface ITemplatevariableService
    {
      
        Task<TemplatevariableModel> GetTemplateVariableById(long logId);
        Task<IEnumerable<TemplatevariableModel>> GetTemplateVariablesAllFiltersAsync(TemplatevariableModel model);        
        Task<IEnumerable<TemplatevariableModel>> GetTemplateVariablesByNetworkByAsync(int orgId, int networkid);                
        Task Update(TemplatevariableModel notificationModel);
        Task<TemplatevariableModel> Create(TemplatevariableModel model);
        Task Delete(TemplatevariableModel notificationModel);
    }
}
