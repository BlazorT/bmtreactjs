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
    public class DspTablesService : IDspTablesService
    {
        private readonly IDspTablesRepository _dspTablesRepository;
        private readonly IAppLogger<DspTablesService> _logger;
        private readonly IMapper _mapper;
        public DspTablesService(IDspTablesRepository dspTablesRepository, IMapper mapper, IAppLogger<DspTablesService> logger)
        {
            _dspTablesRepository = dspTablesRepository ?? throw new ArgumentNullException(nameof(dspTablesRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
                   
          
        public async Task<IEnumerable<DspstableModel>> GetDspTableleByTableIdSync(int tid)
        {
            var lst = await _dspTablesRepository.GetDspTableleByTableIdSync(tid);          
            var mapped = _mapper.Map<IEnumerable<DspstableModel>>(lst);
            return mapped;
        }
        public async Task<IEnumerable<DspstableModel>> GetDspTablesByNameAsync(string Name)
        {
            var lst = await _dspTablesRepository.GetDspTablesByNameAsync(Name);
            var mapped = _mapper.Map<IEnumerable<DspstableModel>>(lst);
            return mapped;
        }
      
        public async Task<DspstableModel> GetDspTableleByIdSync(Int64 id)
        {
            var model = await _dspTablesRepository.GetDspTableleByIdSync(id);
            var mapped = _mapper.Map<DspstableModel>(model);
            return mapped;
        }
        public async Task<IEnumerable<DspstableModel>> GetDspTablesByColumnAndStatusAsnc(int columnIndex, int status)
        {
            var lst = await _dspTablesRepository.GetDspTablesByColumnAndStatusAsnc(columnIndex, status);
            var mList = _mapper.Map<IEnumerable<DspstableModel>>(lst);
            return mList;   
    }     
        public async Task<IEnumerable<DspstableModel>> GetDspTablesAllFiltersAsync(DspstableModel model)
        {
            var entity = _mapper.Map<DspstableModel, Dspstable>(model);
            var vLst = await _dspTablesRepository.GetDspTablesAllFiltersAsync(entity);
            var mList = _mapper.Map<IEnumerable<DspstableModel>>(vLst);
            return mList;
        }

    }
}
