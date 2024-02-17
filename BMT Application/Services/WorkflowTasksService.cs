using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class WorkflowTasksService : IWorkflowTasksService
    {
        private readonly IWorkflowTasksRepository _workflowTasksRepository;
        private readonly IWorkflowFieldRepository _workflowFieldRepository;
        private readonly IAppLogger<WorkflowTasksService> _logger;
        private readonly IMapper _mapper;
        public WorkflowTasksService(IWorkflowTasksRepository workflowTasksRepository, IWorkflowFieldRepository workflowFieldRepository, IMapper mapper, IAppLogger<WorkflowTasksService> logger)
        {
            _workflowTasksRepository = workflowTasksRepository ?? throw new ArgumentNullException(nameof(workflowTasksRepository));
            _workflowFieldRepository = workflowFieldRepository ?? throw new ArgumentNullException(nameof(workflowFieldRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
       
        public async Task<IEnumerable<WffieldModel>> GetWorkflowTaskFieldsAllListAsync(WffieldModel model)
        {
            var iModel = _mapper.Map<Wffield>(model);
            var list = await _workflowFieldRepository.GetWorkflowEntityFieldsAllFiltersAsync(iModel);
            var mapped = _mapper.Map<IEnumerable<WffieldModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<WorkflowtaskModel>> GetWorkflowTasksByEntityList(int entityId = 0)
        {
            var list = await _workflowTasksRepository.GetWorkflowTasksListByStatusAsync(entityId,0);
            var mapped = _mapper.Map<IEnumerable<WorkflowtaskModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<WffieldModel>> GetWorkflowTasksTaskFieldsByEntityList(int entityId = 0)
        {
            var list = await _workflowFieldRepository.GetWorkflowEntityFieldsListByEntityAsync(entityId);
            var mapped = _mapper.Map<IEnumerable<WffieldModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<WorkflowtaskModel>> GetWorkflowTasksAllListAsync(WorkflowtaskModel model)
        {
            var sModel = _mapper.Map<Workflowtask>(model);
            var userList = await _workflowTasksRepository.GetWorkflowTasksAllFiltersAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<WorkflowtaskModel>>(userList);
            return mapped;
        }

        public async Task<WorkflowtaskModel> GetWorkflowTasksByIdList(Int32 id)
        {
            var store = await _workflowTasksRepository.GetWorkflowTaskssByIdAsync(id);
            var mapped = _mapper.Map<WorkflowtaskModel>(store);
            return mapped;
        }
        public async Task<WorkflowtaskModel> Create(WorkflowtaskModel model)
        {
            await ValidateProductIfExist(model);
         
            var mappedEntity = _mapper.Map<WorkflowtaskModel, Workflowtask>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _workflowTasksRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - WorkflowTasksService");

            var newMappedEntity = _mapper.Map<WorkflowtaskModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(WorkflowtaskModel model)
        {          
            var edit = await _workflowTasksRepository.GetWorkflowTaskssByIdAsync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");
           // model.RowVer = edit.RowVer + 1;
           // model.CreatedAt = edit.CreatedAt;
            model.CreatedBy = edit.CreatedBy;
            //model.IsMainDsp = edit.IsMainDsp;
            _mapper.Map<WorkflowtaskModel, Workflowtask>(model, edit);
            await _workflowTasksRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - WorkflowTasksService");
        }

        public async Task Delete(WorkflowtaskModel model)
        {
            ValidateProductIfNotExist(model);
            var enity = await _workflowTasksRepository.GetWorkflowTaskssByIdAsync(model.id);
            if (enity == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _workflowTasksRepository.DeleteAsync(enity);
            _logger.LogInformation($"Entity successfully deleted - WorkflowTasksService");
        }

        private async Task ValidateProductIfExist(WorkflowtaskModel model)
        {
            var existingEntity = await _workflowTasksRepository.GetWorkflowTaskssByIdAsync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }
        public async Task<IEnumerable<WorkflowtaskModel>> BulkAddorUpdates(List<WorkflowtaskModel> ls)
        {
            var incList = _mapper.Map<IEnumerable<Workflowtask>>(ls);
            var vLst = await _workflowTasksRepository.bulkaddorupdates(incList.ToList());
            var retLs = _mapper.Map<IEnumerable<WorkflowtaskModel>>(vLst);

            return retLs;
        }

        public async Task<IEnumerable<WffieldModel>> BulkAddorUpdateFields(List<WffieldModel> ls)
        {
            var incList = _mapper.Map<IEnumerable<Wffield>>(ls);
            var vLst = await _workflowFieldRepository.bulkaddorupdates(incList.ToList());
            var retLs = _mapper.Map<IEnumerable<WffieldModel>>(vLst);

            return retLs;
        }
        private void ValidateProductIfNotExist(WorkflowtaskModel model)
        {
            var existingEntity =  _workflowTasksRepository.GetWorkflowTaskssByIdAsync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");


        }
    }
}
