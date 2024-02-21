using Blazor.Web.UI.Interfaces;
using AutoMapper;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.model;
using com.blazor.bmt.application.interfaces;

namespace Blazor.Web.UI.Services
{
    public class MediaContentPageService : IMediaContentPageService
    {
        private readonly IMediaContentService _mediaContentService;
      //  private readonly IMediaSourceInfoService _mediaSourceInfoService;
        private readonly IMapper _mapper;
        private readonly ILogger<MediaContentPageService> _logger;

        public MediaContentPageService(IMediaContentService MediaContentService,  IMapper mapper, ILogger<MediaContentPageService> logger)
        {
            _mediaContentService = MediaContentService ?? throw new ArgumentNullException(nameof(MediaContentService));
        //    _mediaSourceInfoService = mediaSourceInfoService ?? throw new ArgumentNullException(nameof(mediaSourceInfoService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }     
       
        public async Task<MediacontentViewModel> GetMediaContentByIdAsync(long mediaContentId)
        {
            var video = await _mediaContentService.GetImagesByIdSync(mediaContentId);
            var mappedByName = _mapper.Map<MediacontentViewModel>(video);
        //  var mapped = _mapper.Map<IEnumerable<PriceViewModel>>(list);
            return mappedByName;
        }
        public async Task<IEnumerable<MediacontentViewModel>> addorupdateBulkData(List<MediacontentViewModel> ls)
        {
            var lsidtl = _mapper.Map<IEnumerable<MediacontentModel>>(ls);
            var list = await _mediaContentService.addorupdateBulkData(lsidtl.ToList());
            var mapped = _mapper.Map<IEnumerable<MediacontentViewModel>>(list);
            return mapped;
        }
        //public async Task<IEnumerable<MediacontentViewModel>> GetMediaContentsByAllFilters(MediacontentViewModel MediaContentViewModel)
        //{
        //    var filterEntity = _mapper.Map<MediacontentModel>(MediaContentViewModel);
        //    var list = await _mediaContentService.get(filterEntity);
        //    var mapped = _mapper.Map<IEnumerable<MediacontentViewModel>>(list);
        //    return mapped;
        //}


        //public async Task<IEnumerable<MediaContentViewModel>> GetMediaContentsByStatusAsync(Blazor.Web.UTIL.STATUS_BUSINESS_PLAN status)
        //{
        //    var list = await _mediaContentAppService.GetMediaContentListByStatus(status, UTIL.MEDIA_NETWORKS.SMS);
        //    var mapped = _mapper.Map<IEnumerable<MediaContentViewModel>>(list);
        //    return mapped;
        //}

        //public async Task<IEnumerable<MediacontentViewModel>> GetPaymentsByCategoryAsync(com.blazor.bmt.util.UTIL.PARENT_ENUMS plan)
        //{
        //    throw new Exception("Not Implemented");
        //}
        public async Task<MediacontentViewModel> Create(MediacontentViewModel MediaContentViewModel)
        {
            var mapped = _mapper.Map<MediacontentModel>(MediaContentViewModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");           
            var entityDto = await _mediaContentService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - Media Content PageService");

            var mappedViewModel = _mapper.Map<MediacontentViewModel>(entityDto);
            return mappedViewModel;
        }
      
        //public async Task Update(MediacontentViewModel MediaContentViewModel)
        //{
        //    var mapped = _mapper.Map<MediacontentModel>(MediaContentViewModel);
        //    if (mapped == null)
        //        throw new Exception($"Entity could not be mapped.");

        //    await _mediaContentService.Update(mapped);
        //    _logger.LogInformation($"Entity successfully added - MediaContentPageService");
        //}

        //public async Task Delete(MediacontentViewModel MediaContentViewModel)
        //{
        //    var mapped = _mapper.Map<MediacontentModel>(MediaContentViewModel);
        //    if (mapped == null)
        //        throw new Exception($"Entity could not be mapped.");

        //    await _mediaContentService.Delete(mapped);
        //    _logger.LogInformation($"Entity successfully added - MediaContentPageService");
        //}
       
    }
}
