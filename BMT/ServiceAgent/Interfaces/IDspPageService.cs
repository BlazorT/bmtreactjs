using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.interfaces
{
        public interface IDspPageService
    {
        Task<IEnumerable<DspViewModel>> GetDspsList();
        Task<IEnumerable<DspViewModel>> GetDspsByName(string name);
        Task<IEnumerable<DspViewModel>> GetDspsAllAsync(DspViewModel model);
        Task<IEnumerable<DsppartnerViewModel>> DspPartnerList(int dspId, int statusid);
        Task<DsppartnerViewModel> GetDspPartnerById(int partnerid);
        Task<DspViewModel> GetDspById(int id);
        Task<DspViewModel> Create(DspViewModel vModel);
        Task<IEnumerable<DsppartnerViewModel>> DspPartnerBulkAddorUpdates(List<DsppartnerViewModel> ls);
        Task Update(DspViewModel model);
        Task Delete(DspViewModel model);
    }
    }

