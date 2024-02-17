using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.application.services;
using com.blazor.bmt.core;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.services
{
    public class DspPageService : IDspPageService
    {
        private readonly IDspService _dspService;
        private readonly IDsppartnerService _dsppartnerService;
        private readonly IMapper _mapper;
        private readonly ILogger<DspPageService> _logger;
        public DspPageService(IDspService dspService, IDsppartnerService dsppartnerService, IMapper mapper, ILogger<DspPageService> logger)
        {
            _dspService = dspService ?? throw new ArgumentNullException(nameof(dspService));
            _dsppartnerService = dsppartnerService ?? throw new ArgumentNullException(nameof(dsppartnerService));
            // _categoryAppService = categoryAppService ?? throw new ArgumentNullException(nameof(categoryAppService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<DspViewModel>> GetDspsList()
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _dspService.GetDspsList("");
            var mapped = _mapper.Map<IEnumerable<DspViewModel>>(list);
            return mapped;

        }
        public async Task<IEnumerable<DspViewModel>> GetDspsByName(string name)
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _dspService.GetDspsList(name);
            var mapped = _mapper.Map<IEnumerable<DspViewModel>>(list);
            return mapped;

        }
        public async Task<IEnumerable<DspViewModel>> GetDspsAllAsync(DspViewModel model)
        {
            var sModel = _mapper.Map<DspModel>(model);
            var list = await _dspService.GetDspsAllListAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<DspViewModel>>(list);
            return mapped;

        }
        public async Task<DsppartnerViewModel> GetDspPartnerById(int partnerid) {
            var mdl = await _dsppartnerService.GetDsppartnerByIdList(partnerid);
            var mapped = _mapper.Map<DsppartnerViewModel>(mdl);
            return mapped;
        }
        public async Task<DspViewModel> GetDspById(int id)
        {
            var model = await _dspService.GetDspByIdList(id);
            var mapped = _mapper.Map<DspViewModel>(model);
            return mapped;
        }
        public async Task<IEnumerable<DsppartnerViewModel>> DspPartnerList(int dspId, int statusid)
        {            
            var list = await _dsppartnerService.GetDsppartnersByStatusList(statusid,dspId);
            var mapped = _mapper.Map<IEnumerable<DsppartnerViewModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<DsppartnerViewModel>> DspPartnerBulkAddorUpdates(List<DsppartnerViewModel> ls)
        {
            var lsidtl = _mapper.Map<IEnumerable<DsppartnerModel>>(ls);
            var list = await _dsppartnerService.BulkAddorUpdates(lsidtl.ToList());
            var mapped = _mapper.Map<IEnumerable<DsppartnerViewModel>>(list);
            return mapped;
        }
        public async Task<DspViewModel> Create(DspViewModel vModel)
        {
            var mapped = _mapper.Map<DspModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _dspService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - DspPageService");

            var mappedViewModel = _mapper.Map<DspViewModel>(entityDto);
            return mappedViewModel;
        }

        public async Task Update(DspViewModel model)
        {
            var mapped = _mapper.Map<DspModel>(model);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _dspService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - DspPageService");
        }

        public async Task Delete(DspViewModel vmodel)
        {
            var mapped = _mapper.Map<DspModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _dspService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - DspPageService");
        }
       
    }

}
