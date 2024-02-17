using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.model;

namespace com.blazor.bmt.ui.services
{
    public class VehiclesPageService : IVehiclesPageService
    {
        private readonly IVehiclesService _vehicleAppService;
       //private readonly ICategoryService _categoryAppService;
        private readonly IMapper _mapper;
        private readonly ILogger<VehiclesPageService> _logger;

        public VehiclesPageService(IVehiclesService vehicleAppService, IMapper mapper, ILogger<VehiclesPageService> logger)
        {
            _vehicleAppService = vehicleAppService ?? throw new ArgumentNullException(nameof(vehicleAppService));
           // _categoryAppService = categoryAppService ?? throw new ArgumentNullException(nameof(categoryAppService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        public async Task<IEnumerable<VehicleViewModel>> GetVehicleImages(Int64 vehicleId) {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _vehicleAppService.GetVehiclesList();
            var mapped = _mapper.Map<IEnumerable<VehicleViewModel>>(list);
            return mapped;

        }
        public async Task<IEnumerable<VehicleViewModel>> GetVehiclesByDSPAndStatusAsnc(int dspId, int status)
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _vehicleAppService.GetVehiclesByDspAndStatusAsnc(dspId, status);
            var mapped = _mapper.Map<IEnumerable<VehicleViewModel>>(list);
            return mapped;

        }
       
        public async Task<IEnumerable<VehicleViewModel>> GetVehiclesList()
        {
            //if (string.IsNullOrWhiteSpace(productName))
           // {
                var list = await _vehicleAppService.GetVehiclesList();
                var mapped = _mapper.Map<IEnumerable<VehicleViewModel>>(list);
                return mapped;
           
        }
        public async Task<IEnumerable<VehicleViewModel>> GetVehiclesByName(string name)
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _vehicleAppService.GetVehiclesByName(name);
            var mapped = _mapper.Map<IEnumerable<VehicleViewModel>>(list);
            return mapped;

        }

        public async Task<VehicleViewModel> GetVehicleById(Int64 id)
        {
            var model = await _vehicleAppService.GetVehicleById(id);
            //model.CityId
            var mapped = _mapper.Map<VehicleViewModel>(model);
            return mapped;
        }

        public async Task<IEnumerable<VehicleViewModel>> GetVehiclesByCategoryAndStatusAsnc(int categoryId, int status)
        {
            var list = await _vehicleAppService.GetVehiclesByCategoryAndStatusAsnc(categoryId, status);
            var mapped = _mapper.Map<IEnumerable<VehicleViewModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<VehicleViewModel>> GetVehiclesAllFiltersAsync(VehicleViewModel model)
        {
            var mapped = _mapper.Map<VehicleModel>(model);
            var list = await _vehicleAppService.GetVehiclesAllFiltersAsync(mapped);
            var lst = _mapper.Map<IEnumerable<VehicleViewModel>>(list);
            return lst;
        }


        public async Task<VehicleViewModel> Create(VehicleViewModel vModel)
        {
            var mapped = _mapper.Map<VehicleModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _vehicleAppService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - VehiclesPageService");

            var mappedViewModel = _mapper.Map<VehicleViewModel>(entityDto);
            return mappedViewModel;
        }

        public async Task Update(VehicleViewModel vmodel)
        {
            var mapped = _mapper.Map<VehicleModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _vehicleAppService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - VehiclesPageService");
        }

        public async Task Delete(VehicleViewModel vmodel){
            var mapped = _mapper.Map<VehicleModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _vehicleAppService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - VehiclesPageService");
        }
    }
}
