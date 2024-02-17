using AutoMapper;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.model;
namespace com.blazor.bmt.ui.services
{
    public class InventoryDetailPageService : IInventoryDetailPageService
    {
        private readonly IInventoryDetailService _inventoryDetailService;
       //private readonly ICategoryService _categoryAppService;
        private readonly IMapper _mapper;
        private readonly ILogger<InventoryDetailPageService> _logger;

        public InventoryDetailPageService(IInventoryDetailService inventoryDetailService, IMapper mapper, ILogger<InventoryDetailPageService> logger)
        {
            _inventoryDetailService = inventoryDetailService ?? throw new ArgumentNullException(nameof(inventoryDetailService));
           // _categoryAppService = categoryAppService ?? throw new ArgumentNullException(nameof(categoryAppService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
 
        public async Task<IEnumerable<Inventorydetailviewmodel>> GetInventoryDataAsync() {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _inventoryDetailService.GetInventoryDataAsync();
            var mapped = _mapper.Map<IEnumerable<Inventorydetailviewmodel>>(list);
            return mapped;

        }
        public async Task<Inventorydetailviewmodel> GetInventoryDataByIdSync(Int64 Id)    
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _inventoryDetailService.GetInventoryDataByIdSync(Id);
            var mapped = _mapper.Map<Inventorydetailviewmodel>(list);
            return mapped;

        }
        public async Task<IEnumerable<Inventorydetailviewmodel>> GetInventoryDetailsByDspAndStatusAsnc(int dspId, int status)
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _inventoryDetailService.GetInventoryDetailsByDspAndStatusAsnc(dspId, status);
            var mapped = _mapper.Map<IEnumerable<Inventorydetailviewmodel>>(list);
            return mapped;

        }
   
        public async Task<IEnumerable<Inventorydetailviewmodel>> GetInventoryDataAllFiltersAsync(Inventorydetailviewmodel model)
        {
            var mapped = _mapper.Map<InventorydetailModel>(model);
            var list = await _inventoryDetailService.GetInventoryDataAllFiltersAsync(mapped);
            var lst = _mapper.Map<IEnumerable<Inventorydetailviewmodel>>(list);
            return lst;
        }
        public async Task<IEnumerable<Inventorydetailviewmodel>> GetInventoryDataByProductDetailIdAsync(int productDetailsId)
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _inventoryDetailService.GetInventoryDataByProductDetailIdAsync(productDetailsId);
            var mapped = _mapper.Map<IEnumerable<Inventorydetailviewmodel>>(list);
            return mapped;

        }
        public async Task<IEnumerable<Inventorydetailviewmodel>> addorupdateInventoryDetails(List<Inventorydetailviewmodel> ls) {
           var lsidtl = _mapper.Map<IEnumerable<InventorydetailModel>>(ls);
            var list = await _inventoryDetailService.addorupdateInventoryDetails(lsidtl.ToList());
            var mapped = _mapper.Map<IEnumerable<Inventorydetailviewmodel>>(list);
            return mapped;
        }
        public async Task<Inventorydetailviewmodel> Create(Inventorydetailviewmodel vModel)
        {
            var mapped = _mapper.Map<InventorydetailModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _inventoryDetailService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - InventoryDetailPageService");

            var mappedViewModel = _mapper.Map<Inventorydetailviewmodel>(entityDto);
            return mappedViewModel;
        }

        public async Task Update(Inventorydetailviewmodel vmodel)
        {
            var mapped = _mapper.Map<InventorydetailModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _inventoryDetailService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - InventoryDetailPageService");
        }

        public async Task Delete(Inventorydetailviewmodel vmodel){
            var mapped = _mapper.Map<InventorydetailModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _inventoryDetailService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - InventoryDetailPageService");
        }
    }
}
