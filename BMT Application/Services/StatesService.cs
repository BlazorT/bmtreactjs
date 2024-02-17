using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class StatesService : IStatesService
    {
        private readonly IStatesRepository _stateRepository;
        private readonly IAppLogger<StatesService> _logger;
        private readonly IMapper _mapper;
        public StatesService(IStatesRepository statesRepository, IMapper mapper, IAppLogger<StatesService> logger)
        {
            _stateRepository = statesRepository ?? throw new ArgumentNullException(nameof(statesRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

       

        public async Task<IEnumerable<StateModel>> GetStatesByStatusList(int status)
        {
            var list = await _stateRepository.GetStatesListByStatusAsync(status);          
            var mapped = _mapper.Map<IEnumerable<StateModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<StateModel>> GetStatesList(string keyword)
        {
            var userList = await _stateRepository.GetStatesByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<StateModel>>(userList);
            return mapped;
        }
      
    }
}
