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
    public class DispatchmentService : IDispatchmentService
    {
        private readonly IDispatchmentRepository _dispatchmentRepository;
        private readonly IAppLogger<DispatchmentService> _logger;
        private readonly IMapper _mapper;
        public DispatchmentService(IDispatchmentRepository dispatchmentRepository, IMapper mapper, IAppLogger<DispatchmentService> logger)
        {
            _dispatchmentRepository = dispatchmentRepository ?? throw new ArgumentNullException(nameof(dispatchmentRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }     
       

        public async Task<IEnumerable<DispatchmentModel>> GetDispatchmentsByVehicleIdAndStatusAsnc(Int64 vehicleId, int status)
        {
            var list = await _dispatchmentRepository.GetDispatchmentsByVehicleIdAndStatusAsnc(vehicleId, status);
            var mapped = _mapper.Map<IEnumerable<DispatchmentModel>>(list);
            return mapped;
        }      
        public async Task<IEnumerable<DispatchmentModel>> GetDispatchmentsAllFiltersAsync(DispatchmentModel model)
        {
            var sModel = _mapper.Map<Dispatchment>(model);
            var userList = await _dispatchmentRepository.GetDispatchmentsAllFiltersAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<DispatchmentModel>>(userList);
            return mapped;
        }

        public async Task<DispatchmentModel> GetDispatchmentsByIdSync(Int64 id)
        {
            var store = await _dispatchmentRepository.GetDispatchmentByIdSync(id);
            var mapped = _mapper.Map<DispatchmentModel>(store);
            return mapped;
        }
        public async Task<DispatchmentModel> Create(DispatchmentModel model)
        {
            await ValidateProductIfExist(model);
         
            var mappedEntity = _mapper.Map<DispatchmentModel, Dispatchment>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _dispatchmentRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - DispatchmentService");

            var newMappedEntity = _mapper.Map<DispatchmentModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(DispatchmentModel model)
        {          
            var edit = await _dispatchmentRepository.GetDispatchmentByIdSync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");
            model.RowVer = edit.RowVer + 1;
            model.CreatedAt = edit.CreatedAt;
            model.CreatedBy = edit.CreatedBy;
            //model.IsMainDsp = edit.IsMainDsp;
            _mapper.Map<DispatchmentModel, Dispatchment>(model, edit);
            await _dispatchmentRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - DispatchmentService");
        }

        public async Task Delete(DispatchmentModel model)
        {
            ValidateIfNotExist(model);
            var vehicle = await _dispatchmentRepository.GetDispatchmentByIdSync(model.id);
            if (vehicle == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _dispatchmentRepository.DeleteAsync(vehicle);
            _logger.LogInformation($"Entity successfully deleted - DispatchmentService");
        }

        private async Task ValidateProductIfExist(DispatchmentModel model)
        {
            var existingEntity = await _dispatchmentRepository.GetDispatchmentByIdSync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }
        public async Task<IEnumerable<DispatchmentModel>> BulkAddorUpdates(List<DispatchmentModel> ls)
        {
            var incList = _mapper.Map<IEnumerable<Dispatchment>>(ls);
            var vLst = await _dispatchmentRepository.bulkaddorupdates(incList.ToList());
            var retLs = _mapper.Map<IEnumerable<DispatchmentModel>>(vLst);

            return retLs;
        }
        private void ValidateIfNotExist(DispatchmentModel model)
        {
            var existingEntity = _dispatchmentRepository.GetDispatchmentByIdSync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");


        }
    }
}
