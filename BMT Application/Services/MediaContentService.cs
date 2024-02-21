using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using System;
using com.blazor.bmt.core.interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class MediaContentService : IMediaContentService
    {
        private readonly IMediaContentRepository _mediaContentRepository;
       // private readonly IAppLogger<MediaContentService> _logger;
        private readonly IMapper _mapper;
        public MediaContentService(IMediaContentRepository mediaContentRepository, IMapper mapper)
        {
            _mediaContentRepository = mediaContentRepository ?? throw new ArgumentNullException(nameof(mediaContentRepository));
           // _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

        public async Task<MediacontentModel> GetImagesByIdSync(Int64 vid)
        {
            var list = await _mediaContentRepository.GetVehicleImagesByIdSync(vid);          
            var mlst = _mapper.Map<MediacontentModel>(list);
            return mlst;
        }
        
         public async Task<IEnumerable<MediacontentModel>> addorupdateBulkData(List<MediacontentModel> ls)
        {
            var incList = _mapper.Map<IEnumerable<Mediacontent>>(ls);
            var vLst = await _mediaContentRepository.addorupdateBulkImage(incList.ToList());
            var retLs = _mapper.Map<IEnumerable<MediacontentModel>>(vLst);

            return retLs;
        }
        public async Task<NotificationModel> Create(MediacontentModel model)
        {
            await ValidateIfExist(model);

            var mappedEntity = _mapper.Map<MediacontentModel, Mediacontent>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _mediaContentRepository.AddAsync(mappedEntity);
           // _logger.LogInformation($"Entity successfully added - CDPRunAppService");

            var newMappedEntity = _mapper.Map<NotificationModel>(newEntity);
            return newMappedEntity;
        }
        private async Task ValidateIfExist(MediacontentModel model)
        {
            var existingEntity = await _mediaContentRepository.GetVehicleImagesByIdSync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }

    }
}
