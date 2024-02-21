using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.application.services;
using com.blazor.bmt.core;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.services
{
    public class OrgPageService : IOrgPageService
    {
        private readonly IOrganizationService _organizationService;
       // private readonly IOrgpartnerService _OrgpartnerService;
        private readonly IMapper _mapper;
        private readonly ILogger<OrgPageService> _logger;
        public OrgPageService(IOrganizationService organizationService,  IMapper mapper, ILogger<OrgPageService> logger)
        {
            _organizationService = organizationService ?? throw new ArgumentNullException(nameof(organizationService));
           // _OrgpartnerService = OrgpartnerService ?? throw new ArgumentNullException(nameof(OrgpartnerService));
            // _categoryAppService = categoryAppService ?? throw new ArgumentNullException(nameof(categoryAppService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<OrganizationViewModel>> GetOrgsList()
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _organizationService.GetOrgsList("");
            var mapped = _mapper.Map<IEnumerable<OrganizationViewModel>>(list);
            return mapped;

        }
        public async Task<IEnumerable<OrganizationViewModel>> GetOrgsByName(string name)
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _organizationService.GetOrgsList(name);
            var mapped = _mapper.Map<IEnumerable<OrganizationViewModel>>(list);
            return mapped;

        }
        public async Task<IEnumerable<OrganizationViewModel>> GetOrgsAllAsync(OrganizationViewModel model)
        {
            var sModel = _mapper.Map<OrganizationModel>(model);
            var list = await _organizationService.GetOrgsAllListAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<OrganizationViewModel>>(list);
            return mapped;

        }
      
        public async Task<OrganizationViewModel> GetOrgById(int id)
        {
            var model = await _organizationService.GetOrgByIdList(id);
            var mapped = _mapper.Map<OrganizationViewModel>(model);
            return mapped;
        }      
      
        public async Task<OrganizationViewModel> Create(OrganizationViewModel vModel)
        {
            var mapped = _mapper.Map<OrganizationModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _organizationService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - OrgPageService");

            var mappedViewModel = _mapper.Map<OrganizationViewModel>(entityDto);
            return mappedViewModel;
        }

        public async Task Update(OrganizationViewModel model)
        {
            var mapped = _mapper.Map<OrganizationModel>(model);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _organizationService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - OrgPageService");
        }

        public async Task Delete(OrganizationViewModel vmodel)
        {
            var mapped = _mapper.Map<OrganizationModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _organizationService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - OrgPageService");
        }
       
    }

}
