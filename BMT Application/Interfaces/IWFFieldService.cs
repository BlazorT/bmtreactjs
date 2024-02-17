using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IWFFieldService
    {
        Task<IEnumerable<WffieldModel>> GetWorkflowEntityFieldsByEntityList( int entityId = 0);    
       
        Task<WffieldModel> GetWorkflowEntityFieldsByIdList(Int32 id);
        Task<IEnumerable<WffieldModel>> GetWorkflowEntityFieldsAllListAsync(WffieldModel model);
        Task<IEnumerable<WffieldModel>> BulkAddorUpdates(List<WffieldModel> ls);
        Task<WffieldModel> Create(WffieldModel model);
        Task Update(WffieldModel model);
        Task Delete(WffieldModel model);

    }
}
