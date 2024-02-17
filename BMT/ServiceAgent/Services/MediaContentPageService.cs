using AutoMapper;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.model;
namespace com.blazor.bmt.ui.services
{
    public class MediaContentPageService : IMediaContentPageService
    {
        private readonly IMediaContentService _mediaContentService;
       //private readonly ICategoryService _categoryAppService;
        private readonly IMapper _mapper;
        private readonly ILogger<MediaContentPageService> _logger;

        public MediaContentPageService(IMediaContentService mediaContentService, IMapper mapper, ILogger<MediaContentPageService> logger)
        {
            _mediaContentService = mediaContentService ?? throw new ArgumentNullException(nameof(mediaContentService));           
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
       
        //Task<IEnumerable<Inventorydetailviewmodel>> addorupdateBulkData(List<MediacontentViewModel> ls);
        //Task<MediacontentViewModel> Create(MediacontentViewModel model);
        public async Task<MediacontentViewModel> GetMediaContentByIdSync(Int64 Id)    
        {
            //if (string.IsNullOrWhiteSpace(productName))
            // {
            var list = await _mediaContentService.GetImagesByIdSync(Id);
            var mapped = _mapper.Map<MediacontentViewModel>(list);
            return mapped;

        }
    
        public async Task<IEnumerable<MediacontentViewModel>> addorupdateBulkData(List<MediacontentViewModel> ls) {
           var lsidtl = _mapper.Map<IEnumerable<MediacontentModel>>(ls);
            var list = await _mediaContentService.addorupdateBulkData(lsidtl.ToList());
            var mapped = _mapper.Map<IEnumerable<MediacontentViewModel>>(list);
            return mapped;
        }
        public async Task<MediacontentViewModel> Create(MediacontentViewModel vModel)
        {
            var mapped = _mapper.Map<MediacontentModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _mediaContentService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - MediaContentPageService");

            var mappedViewModel = _mapper.Map<MediacontentViewModel>(entityDto);
            return mappedViewModel;
        }

        //public async Task Update(MediacontentViewModel vmodel)
        //{
        //    var mapped = _mapper.Map<MediacontentModel>(vmodel);
        //    if (mapped == null)
        //        throw new Exception($"Entity could not be mapped.");

        //    await _mediaContentService.Update(mapped);
        //    _logger.LogInformation($"Entity successfully added - MediaContentageService");
        //}

        //public async Task Delete(Inventorydetailviewmodel vmodel){
        //    var mapped = _mapper.Map<InventorydetailModel>(vmodel);
        //    if (mapped == null)
        //        throw new Exception($"Entity could not be mapped.");

        //    await _mediaContentService.Delete(mapped);
        //    _logger.LogInformation($"Entity successfully added - MediaContentageService");
        //}
    }
}
