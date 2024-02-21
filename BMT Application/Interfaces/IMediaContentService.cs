using AutoMapper;
using com.blazor.bmt.application.model;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IMediaContentService
    {


        Task<MediacontentModel> GetImagesByIdSync(Int64 vid);

        Task<IEnumerable<MediacontentModel>> addorupdateBulkData(List<MediacontentModel> ls);

        Task<NotificationModel> Create(MediacontentModel model);

    }
}
