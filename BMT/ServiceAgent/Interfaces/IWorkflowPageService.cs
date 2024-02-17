using com.blazor.bmt.application.model;
using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.interfaces
{
        public interface IWorkflowPageService
    {
        //Task<IEnumerable<WorkflowtaskViewModel>> GetWorkflowTasksList();
        Task<IEnumerable<WorkflowtaskViewModel>> GetWorkflowTasksByEntityId(int entityId = 0);
        Task<IEnumerable<WffieldViewModel>> GetWorkflowTaskFieldssByEntityAndTaskId(int entityId = 0, int taskId = 0);
        Task<IEnumerable<WorkflowtaskViewModel>> GetWorkflowTasksAllAsync(WorkflowtaskViewModel model);
        Task<IEnumerable<WffieldViewModel>> GetWorkflowTaskFieldsAllAsync(WffieldViewModel fModel);
        Task<WorkflowtaskModel> GetWorkflowTasksById(int taskId);
        Task<WorkflowtaskViewModel> TaskWithBulkAddorUpdates(WorkflowtaskViewModel task);
        Task<IEnumerable<WffieldViewModel>> WorkflowTaskFieldBulkAddorUpdates(List<WffieldViewModel> ls);
        Task<WorkflowtaskViewModel> Create(WorkflowtaskViewModel vModel);
        Task Update(WorkflowtaskViewModel model);
        Task Delete(WorkflowtaskViewModel model);
    }
    }

