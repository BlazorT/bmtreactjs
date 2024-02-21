using Blazor.Web.Application.Models;
using Blazor.Web.UI.ViewModels;
using DocumentFormat.OpenXml.InkML;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.UI.Interfaces
{
    public interface IMediaSourcePageService
    {
      
        Task<MediaSourceInfoModel> Create(MediaSourceInfoModel model);
        Task<MediaSourceInfoModel> getMediaSourceInfoByIdAsync(Int64 id);
        Task<MediaSourceInfoModel>  Update(MediaSourceInfoModel model);

        Task<MediaSourceInfoModel> SharpUpdate(MediaSourceInfoModel model);
        Task Delete(long id);


    }
}
