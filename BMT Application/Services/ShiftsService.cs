using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class ShiftsService : IShiftsService
    {
        private readonly IShiftsRepository _shiftsRepository;
        private readonly IAppLogger<ShiftsService> _logger;
        private readonly IMapper _mapper;
        public ShiftsService(IShiftsRepository shiftsRepository, IMapper mapper, IAppLogger<ShiftsService> logger)
        {
            _shiftsRepository = shiftsRepository ?? throw new ArgumentNullException(nameof(shiftsRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        public async Task<IEnumerable<ShiftModel>> GetShiftsByStatusAsync(int status)
        {
            var list = await _shiftsRepository.GetShiftsByStatusAsync(status);
            var mapped = _mapper.Map<IEnumerable<ShiftModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<ShiftModel>> GetShiftsByNameAsync(string keyword)
        {
            var userList = await _shiftsRepository.GetShiftsByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<ShiftModel>>(userList);
            return mapped;
        }
        public async Task<IEnumerable<ShiftModel>> GetShiftsAllFiltersAsync(ShiftModel model)
        {
            var sModel = _mapper.Map<Shift>(model);
            var userList = await _shiftsRepository.GetShiftsAllFiltersAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<ShiftModel>>(userList);
            return mapped;
        }

        public async Task<ShiftModel> GetShiftByIdAsync(Int32 id)
        {
            var store = await _shiftsRepository.GetShiftByIdAsync(id);
            var mapped = _mapper.Map<ShiftModel>(store);
            return mapped;
        }
        public async Task<ShiftModel> Create(ShiftModel model)
        {
            await ValidateProductIfExist(model);

            var mappedEntity = _mapper.Map<ShiftModel, Shift>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _shiftsRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - ShiftService");

            var newMappedEntity = _mapper.Map<ShiftModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(ShiftModel model)
        {            
            var edit = await _shiftsRepository.GetShiftByIdAsync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<ShiftModel, Shift>(model, edit);
            await _shiftsRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - ShiftService");
        }

        public async Task Delete(ShiftModel model)
        {
            ValidateProductIfNotExist(model);
            var vehicle = await _shiftsRepository.GetShiftByIdAsync(model.id);
            if (vehicle == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _shiftsRepository.DeleteAsync(vehicle);
            _logger.LogInformation($"Entity successfully deleted - ShiftService");
        }

        private async Task ValidateProductIfExist(ShiftModel model)
        {
            var existingEntity = await _shiftsRepository.GetShiftByIdAsync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }

        private void ValidateProductIfNotExist(ShiftModel model)
        {
            var existingEntity = _shiftsRepository.GetShiftByIdAsync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");


        }
    }
}
