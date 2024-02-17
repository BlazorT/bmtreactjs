using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IMediaContentRepository : IRepositoryTransaction<Mediacontent>
    {
       // Task<IEnumerable<MediaContent>> GetVehicleImagesListAsync(string keyword);
        Task<Mediacontent> GetVehicleImagesByIdSync(Int64 id);
        Task<IEnumerable<Mediacontent>> addorupdateBulkImage(List<Mediacontent> ls);


    }
}
