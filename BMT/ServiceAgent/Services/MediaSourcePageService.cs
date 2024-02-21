using Blazor.Web.Application.Interfaces;
using Blazor.Web.Application.Models;
using Blazor.Web.UI.Interfaces;
using Blazor.Web.UI.ViewModels;
// Microsoft Namespaces
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.UI.Services
{
    public class MediaSourcePageService : IMediaSourcePageService
    {
       
        private readonly IMediaSourceInfoService _mediaSourceInfoService;       
        private readonly ILogger<MediaSourcePageService> _logger;

        public MediaSourcePageService(IMediaSourceInfoService mediaSourceInfoService,  ILogger<MediaSourcePageService> logger)
        {
            
            _mediaSourceInfoService = mediaSourceInfoService ?? throw new ArgumentNullException(nameof(mediaSourceInfoService));       
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        //Task<MediaSourceInfoModel> Create(MediaSourceInfoModel mediaSourceInfoModel);
        //Task<MediaSourceInfoModel> getMediaSourceInfoByIdAsync(Int64 id);
        //Task Update(MediaContentViewModel MediaContentViewModel);

        //Task Delete(MediaContentViewModel MediaContentViewModel);
       // Task Delete(long id);
        public async Task<MediaSourceInfoModel> Create(MediaSourceInfoModel model)
        {

            var insertedEntity = await _mediaSourceInfoService.Create(model);
            // _addressService.GetAddressById
           // var mappedByName = _mapper.Map<IEnumerable<MediaContentViewModel>>(listByName);
            return insertedEntity;
        }
        public async Task<MediaSourceInfoModel> Update(MediaSourceInfoModel model)
        {

            await _mediaSourceInfoService.Update(model);
            return model;
            // _addressService.GetAddressById
            // var mappedByName = _mapper.Map<IEnumerable<MediaContentViewModel>>(listByName);

        }
        public async Task<MediaSourceInfoModel> SharpUpdate(MediaSourceInfoModel model)
        {

            await _mediaSourceInfoService.SharpUpdate(model);
            return model;
            // _addressService.GetAddressById
            // var mappedByName = _mapper.Map<IEnumerable<MediaContentViewModel>>(listByName);

        }
        public async Task Delete(Int64 id)
        {

           // TODO
            // _addressService.GetAddressById
            // var mappedByName = _mapper.Map<IEnumerable<MediaContentViewModel>>(listByName);

        }

        public async Task<MediaSourceInfoModel> getMediaSourceInfoByIdAsync(long id)
        {
            var video = await _mediaSourceInfoService.GetMediaContentById(id);
           // var mappedByName = _mapper.Map<MediaContentViewModel>(video);
        //  var mapped = _mapper.Map<IEnumerable<PriceViewModel>>(list);
            return video;
        }
       
    }
}
