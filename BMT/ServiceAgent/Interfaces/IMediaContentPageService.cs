
using com.blazor.bmt.viewmodels;
namespace Blazor.Web.UI.Interfaces
{
    public interface IMediaContentPageService
    {
        
        Task<MediacontentViewModel> GetMediaContentByIdAsync(System.Int64 mediaContentId);

        //Task<IEnumerable<MediacontentViewModel>> GetPaymentsByCategoryAsync(UTIL.Pack.PACKAGES packages);
        Task<IEnumerable<MediacontentViewModel>> addorupdateBulkData(List<MediacontentViewModel> ls);
        Task<MediacontentViewModel> Create(MediacontentViewModel MediaContentViewModel);


    }
}
