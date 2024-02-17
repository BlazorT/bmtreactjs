using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.services
{
    public class IntegrationPageService : IIntegrationPageService
    {
        private readonly IIntegrationService _integrationService;       
        private readonly IMapper _mapper;
        private readonly ILogger<IntegrationPageService> _logger;
        public IntegrationPageService( IIntegrationService integrationService, IMapper mapper, ILogger<IntegrationPageService> logger)
        {
            _integrationService = integrationService ?? throw new ArgumentNullException(nameof(integrationService));    
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }   
  
        public async Task<IEnumerable<IntegrationservicesettingViewModel>> GetIntegrationServicesByName(string keyword)
        {
           
            var list = await _integrationService.GetIntegrationserviceByNameAsync(""+keyword);
            var mapped = _mapper.Map<IEnumerable<IntegrationservicesettingViewModel>>(list);
            return mapped;

        }
   
        public async Task<IEnumerable<IntegrationservicesettingViewModel>> GetIntegrationServicesAllAsync(IntegrationservicesettingViewModel model)
        {
            var sModel = _mapper.Map<IntegrationservicesettingModel>(model);
            var list = await _integrationService.GetIntegrationserviceAllFiltersAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<IntegrationservicesettingViewModel>>(list);
            return mapped;

        }
        public async Task<IntegrationservicesettingViewModel> GetByIdAsync(int id) {
            var mdl = await _integrationService.GetByIdAsync(id);
            var mapped = _mapper.Map<IntegrationservicesettingViewModel>(mdl);
            return mapped;
        }    
        public async Task<IntegrationservicesettingViewModel> Create(IntegrationservicesettingViewModel vModel)
        {
            var mapped = _mapper.Map<IntegrationservicesettingModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _integrationService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - IntegrationPageService");

            var mappedViewModel = _mapper.Map<IntegrationservicesettingViewModel>(entityDto);
            return mappedViewModel;
        }

        public async Task Update(IntegrationservicesettingViewModel model)
        {
            var mapped = _mapper.Map<IntegrationservicesettingModel>(model);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _integrationService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - IntegrationPageService");
        }

        public async Task Delete(IntegrationservicesettingViewModel vmodel)
        {
            var mapped = _mapper.Map<IntegrationservicesettingModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _integrationService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - IntegrationPageService");
        }
       
    }

}
