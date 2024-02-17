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
    public class InspectionItemsService : IInspectionItemsService
    {
        private readonly IInspectionItemsRepository _inspectionItemsRepository;
        private readonly IAppLogger<InspectionItemsService> _logger;
        private readonly IMapper _mapper;
        public InspectionItemsService(IInspectionItemsRepository inspectionItemsRepository, IMapper mapper, IAppLogger<InspectionItemsService> logger)
        {
            _inspectionItemsRepository = inspectionItemsRepository ?? throw new ArgumentNullException(nameof(inspectionItemsRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
      
        public async Task<IEnumerable<InspectionitemModel>> GetInspectionItemslListAsync(Int64 inspectonReportId)
        {
           
            var userList = await _inspectionItemsRepository.GetInspectionItemsBYReportIdAsync(inspectonReportId);
            var mapped = _mapper.Map<IEnumerable<InspectionitemModel>>(userList);
            return mapped;
        }

        public async Task<InspectionitemModel> Create(InspectionitemModel model)
        {

            var cModel = _mapper.Map<Inspectionitem>(model);
          var addedItem=  await _inspectionItemsRepository.AddAsync(cModel);
            var Item = _mapper.Map<InspectionitemModel>(model);            
            _logger.LogInformation($"Entity successfully updated - InspectionItemsService");
            return Item;
        }

        public async Task Update(InspectionitemModel model)
        {          
            var edit = await _inspectionItemsRepository.GetByIdAsync(model.Id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");
           // model.RowVer = edit.RowVer + 1;
            model.CreatedAt = edit.CreatedAt;
            model.CreatedBy = edit.CreatedBy;
            //model.IsMainDsp = edit.IsMainDsp;
            _mapper.Map<InspectionitemModel, Inspectionitem>(model, edit);
            await _inspectionItemsRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - InspectionItemsService");
        }

        public async Task Delete(InspectionitemModel model)
        {
            ValidateProductIfNotExist(model);
            var edit = await _inspectionItemsRepository.GetByIdAsync(model.Id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _inspectionItemsRepository.DeleteAsync(edit);
            _logger.LogInformation($"Entity successfully deleted - StoresService");
        }

        private async Task ValidateProductIfExist(InspectionitemModel model)
        {
            var existingEntity = await _inspectionItemsRepository.GetByIdAsync(model.Id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }
        public async Task<IEnumerable<InspectionitemModel>> BulkAddorUpdates(List<InspectionitemModel> ls)
        {
            var incList = _mapper.Map<IEnumerable<Inspectionitem>>(ls);
            var vLst = await _inspectionItemsRepository.bulkaddorupdates(incList.ToList());
            var retLs = _mapper.Map<IEnumerable<InspectionitemModel>>(vLst);

            return retLs;
        }
        private void ValidateProductIfNotExist(InspectionitemModel model)
        {
            var existingEntity = _inspectionItemsRepository.GetByIdAsync(model.Id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");


        }
    }
}
