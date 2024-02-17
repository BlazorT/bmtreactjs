using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.application.services;
using com.blazor.bmt.util;

namespace com.blazor.bmt.ui.services
{
    public class DispatchmentPageService : IDispatchmentPageService
    {
        private readonly IDispatchmentService _dispatchmentService;
       // private readonly IVehicleInspectionService  _vehicleInspectionService;      
        private readonly IMapper _mapper;
        private readonly ILogger<DispatchmentPageService> _logger;

        public DispatchmentPageService(IDispatchmentService dispatchmentService,  IMapper mapper, ILogger<DispatchmentPageService> logger)
        {
            _dispatchmentService = dispatchmentService ?? throw new ArgumentNullException(nameof(dispatchmentService));
           // _vehicleInspectionService = vehicleInspectionService ?? throw new ArgumentNullException(nameof(vehicleInspectionService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
       
  
        public async Task<DispatchmentViewModel> GetDispatchmentById(Int64 id)
        {
            var model = await _dispatchmentService.GetDispatchmentsByIdSync(id);
           
            var mapped = _mapper.Map<DispatchmentViewModel>(model);           

            return mapped;
        }

        public async Task<IEnumerable<DispatchmentViewModel>> GetDispatchmentByVehicleIdAndStatusAsynch(Int64 vehicleId, int status)
        {
            var list = await _dispatchmentService.GetDispatchmentsByVehicleIdAndStatusAsnc(vehicleId, status);
            var mapped = _mapper.Map<IEnumerable<DispatchmentViewModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<DispatchmentViewModel>> GetDispatchmentsAllAsync(DispatchmentViewModel model)
        {
            var mapped = _mapper.Map<DispatchmentModel>(model);
            var list = await _dispatchmentService.GetDispatchmentsAllFiltersAsync(mapped);
            var lst = _mapper.Map<IEnumerable<DispatchmentViewModel>>(list);
            return lst;
        }
        public async Task<IEnumerable<DispatchmentViewModel>> AddUpdateBulkDispatchments(List<DispatchmentViewModel> vlst)
        {            
            var lst = _mapper.Map<IEnumerable<DispatchmentModel>>(vlst);           
            var dbLst = await _dispatchmentService.BulkAddorUpdates(lst.ToList());
            var iLst = _mapper.Map<IEnumerable<DispatchmentViewModel>>(dbLst);
            return iLst;
        }
      
        public async Task<DispatchmentViewModel> Create(DispatchmentViewModel vModel)
        {
            var mapped = _mapper.Map<DispatchmentModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _dispatchmentService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - DispatchmentPageService");

            var mappedViewModel = _mapper.Map<DispatchmentViewModel>(entityDto);
            return mappedViewModel;
        }

        public async Task Update(DispatchmentViewModel vmodel)
        {
            var mapped = _mapper.Map<DispatchmentModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _dispatchmentService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - DispatchmentPageService");
        }

        public async Task Delete(DispatchmentViewModel vmodel){
            var mapped = _mapper.Map<DispatchmentModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _dispatchmentService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - DispatchmentPageService");
        }
    }
}
