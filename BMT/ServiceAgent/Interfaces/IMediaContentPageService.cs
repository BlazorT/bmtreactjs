
using com.blazor.bmt.core;
using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.interfaces
{
    public interface IMediaContentPageService
    {

        Task<MediacontentViewModel> GetMediaContentByIdSync(Int64 Id);
        Task<IEnumerable<MediacontentViewModel>> addorupdateBulkData(List<MediacontentViewModel> ls);
        Task<MediacontentViewModel> Create(MediacontentViewModel model);
        //Task Update(Inventorydetailviewmodel model);
        //Task Delete(Inventorydetailviewmodel model);
    }
}
