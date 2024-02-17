using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IWorkflowTasksService
    {
        Task<IEnumerable<WorkflowtaskModel>> GetWorkflowTasksByEntityList( int entityId = 0);    
       
        Task<WorkflowtaskModel> GetWorkflowTasksByIdList(Int32 id);
        Task<IEnumerable<WorkflowtaskModel>> GetWorkflowTasksAllListAsync(WorkflowtaskModel model);
        Task<IEnumerable<WffieldModel>> GetWorkflowTaskFieldsAllListAsync(WffieldModel model);
        Task<IEnumerable<WffieldModel>> GetWorkflowTasksTaskFieldsByEntityList(int entityId = 0);
        Task<IEnumerable<WffieldModel>> BulkAddorUpdateFields(List<WffieldModel> ls);
        Task<IEnumerable<WorkflowtaskModel>> BulkAddorUpdates(List<WorkflowtaskModel> ls);
        Task<WorkflowtaskModel> Create(WorkflowtaskModel model);
        Task Update(WorkflowtaskModel model);
        Task Delete(WorkflowtaskModel model);

    }
}
