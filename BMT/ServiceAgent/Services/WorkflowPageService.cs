using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.application.services;
using com.blazor.bmt.core;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;
using System.Collections.Generic;

namespace com.blazor.bmt.ui.services
{
    public class WorkflowPageService : IWorkflowPageService
    {
        private readonly IWorkflowTasksService _workflowTasksService;
       // private readonly IDsppartnerService _dsppartnerService;
        private readonly IMapper _mapper;
        private readonly ILogger<WorkflowPageService> _logger;
        public WorkflowPageService(IWorkflowTasksService workflowTasksService, IMapper mapper, ILogger<WorkflowPageService> logger)
        {
            _workflowTasksService = workflowTasksService ?? throw new ArgumentNullException(nameof(workflowTasksService));        
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
   
        public async Task<IEnumerable<WorkflowtaskViewModel>> GetWorkflowTasksAllAsync(WorkflowtaskViewModel  model)
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var iEntity = _mapper.Map<WorkflowtaskModel>(model);
            var list = await _workflowTasksService.GetWorkflowTasksAllListAsync(iEntity);
            var mapped = _mapper.Map<IEnumerable<WorkflowtaskViewModel>>(list);
            return mapped;

        }
        public async Task<IEnumerable<WffieldViewModel>> GetWorkflowTaskFieldsAllAsync(WffieldViewModel fModel)
        {           
            var iEntity = _mapper.Map<WffieldModel>(fModel);
            var list = await _workflowTasksService.GetWorkflowTaskFieldsAllListAsync(iEntity);
            var mapped = _mapper.Map<IEnumerable<WffieldViewModel>>(list);
            return mapped;

        }

        public async Task<IEnumerable<WorkflowtaskViewModel>> GetWorkflowTasksByEntityId(int entityId = 0)
        {
            var mdlls = await _workflowTasksService.GetWorkflowTasksByEntityList(entityId);
            var mappedls = _mapper.Map<IEnumerable<WorkflowtaskViewModel>>(mdlls);
            return mappedls;
        }


        public async Task<WorkflowtaskModel> GetWorkflowTasksById(int taskId) {
            var mdl = await _workflowTasksService.GetWorkflowTasksByIdList(taskId);
            var mapped = _mapper.Map<WorkflowtaskModel>(mdl);
            return mapped;
        }
      
       
        public async Task<IEnumerable<WffieldViewModel>> GetWorkflowTaskFieldssByEntityAndTaskId(int entityId = 0, int taskId = 0)
        {            
            var list = await _workflowTasksService.GetWorkflowTasksTaskFieldsByEntityList(entityId);
            var mapped = _mapper.Map<IEnumerable<WffieldViewModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<WffieldViewModel>> WorkflowTaskFieldBulkAddorUpdates(List<WffieldViewModel> ls)
        {
            var lsidtl = _mapper.Map<IEnumerable<WffieldModel>>(ls);
            var list = await _workflowTasksService.BulkAddorUpdateFields(lsidtl.ToList());
            var mapped = _mapper.Map<IEnumerable<WffieldViewModel>>(list);
            return mapped;
        }
        public async Task<WorkflowtaskViewModel> TaskWithBulkAddorUpdates(WorkflowtaskViewModel task)
        {
            var mapped = _mapper.Map<WorkflowtaskModel>(task);
            WorkflowtaskModel created = new WorkflowtaskModel();
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");
            if(mapped.id > 0)
                 await _workflowTasksService.Update(mapped);
            else
                created = await _workflowTasksService.Create(mapped);

            if (created.id > 0 && task.taskfields != null && task.taskfields.Any())
            {
                List<WffieldModel> ls = new List<WffieldModel>();
                foreach (WffieldViewModel vItem in task.taskfields)
                {
                    ls.Add(new WffieldModel { id = vItem.Id, DataTypeId = vItem.DataTypeId, DefaultValue = vItem.DefaultValue, EntityId = vItem.EntityId, Status = vItem.Status, Length = vItem.Length, CreatedAt = GlobalUTIL.CurrentDateTime, CreatedBy = Convert.ToInt32(vItem.CreatedBy), LastUpdatedBy = Convert.ToInt32(vItem.CreatedBy), LastUpdatedAt = vItem.LastUpdatedAt, Expression = vItem.Expression, RowVer=1, Name= vItem.Name, FieldTypeId= vItem.FieldTypeId });
                }
                await _workflowTasksService.BulkAddorUpdateFields(ls);

            }
            _logger.LogInformation($"Entity successfully added - WorkflowPageService");

            var mappedViewModel = _mapper.Map<WorkflowtaskViewModel>(created);
            return mappedViewModel;
        }
        public async Task<WorkflowtaskViewModel> Create(WorkflowtaskViewModel vModel)
        {
            var mapped = _mapper.Map<WorkflowtaskModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _workflowTasksService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - WorkflowPageService");

            var mappedViewModel = _mapper.Map<WorkflowtaskViewModel>(entityDto);
            return mappedViewModel;
        }

        public async Task Update(WorkflowtaskViewModel model)
        {
            var mapped = _mapper.Map<WorkflowtaskModel>(model);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _workflowTasksService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - WorkflowPageService");
        }

        public async Task Delete(WorkflowtaskViewModel vmodel)
        {
            var mapped = _mapper.Map<WorkflowtaskModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _workflowTasksService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - WorkflowPageService");
        }
       
    }

}
