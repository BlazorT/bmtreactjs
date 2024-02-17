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
    public class WFFieldService : IWFFieldService
    {
        private readonly IWorkflowFieldRepository _workflowFieldRepository;
        private readonly IAppLogger<WFFieldService> _logger;
        private readonly IMapper _mapper;
        public WFFieldService(IWorkflowFieldRepository workflowFieldRepository, IMapper mapper, IAppLogger<WFFieldService> logger)
        {
            _workflowFieldRepository = workflowFieldRepository ?? throw new ArgumentNullException(nameof(workflowFieldRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
               
       
        public async Task<IEnumerable<WffieldModel>> GetWorkflowEntityFieldsByEntityList(int entityId = 0)
        {
            var list = await _workflowFieldRepository.GetWorkflowEntityFieldsListByEntityAsync(entityId);
            var mapped = _mapper.Map<IEnumerable<WffieldModel>>(list);
            return mapped;
        }
      
        public async Task<IEnumerable<WffieldModel>> GetWorkflowEntityFieldsAllListAsync(WffieldModel model)
        {
            var sModel = _mapper.Map<Wffield>(model);
            var userList = await _workflowFieldRepository.GetWorkflowEntityFieldsAllFiltersAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<WffieldModel>>(userList);
            return mapped;
        }

        public async Task<WffieldModel> GetWorkflowEntityFieldsByIdList(Int32 id)
        {
            var store = await _workflowFieldRepository.GetWorkflowEntityFieldsByIdAsync(id);
            var mapped = _mapper.Map<WffieldModel>(store);
            return mapped;
        }
        public async Task<WffieldModel> Create(WffieldModel model)
        {
            await ValidateProductIfExist(model);
         
            var mappedEntity = _mapper.Map<WffieldModel, Wffield>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _workflowFieldRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - AspnetRunAppService");

            var newMappedEntity = _mapper.Map<WffieldModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(WffieldModel model)
        {          
            var edit = await _workflowFieldRepository.GetWorkflowEntityFieldsByIdAsync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");
           // model.RowVer = edit.RowVer + 1;
            model.CreatedAt = edit.CreatedAt;
            model.CreatedBy = edit.CreatedBy;
            //model.IsMainDsp = edit.IsMainDsp;
            _mapper.Map<WffieldModel, Wffield>(model, edit);
            await _workflowFieldRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - StoresService");
        }

        public async Task Delete(WffieldModel model)
        {
            ValidateProductIfNotExist(model);
            var vehicle = await _workflowFieldRepository.GetWorkflowEntityFieldsByIdAsync(model.id);
            if (vehicle == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _workflowFieldRepository.DeleteAsync(vehicle);
            _logger.LogInformation($"Entity successfully deleted - StoresService");
        }

        private async Task ValidateProductIfExist(WffieldModel model)
        {
            var existingEntity = await _workflowFieldRepository.GetWorkflowEntityFieldsByIdAsync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }
        public async Task<IEnumerable<WffieldModel>> BulkAddorUpdates(List<WffieldModel> ls)
        {
            var incList = _mapper.Map<IEnumerable<Wffield>>(ls);
            var vLst = await _workflowFieldRepository.bulkaddorupdates(incList.ToList());
            var retLs = _mapper.Map<IEnumerable<WffieldModel>>(vLst);

            return retLs;
        }
        private void ValidateProductIfNotExist(WffieldModel model)
        {
            var existingEntity = _workflowFieldRepository.GetWorkflowEntityFieldsByIdAsync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");


        }
    }
}
