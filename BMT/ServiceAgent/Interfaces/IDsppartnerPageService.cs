using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.interfaces
{
        public interface IDsppartnerPageService
    {
        Task<IEnumerable<DsppartnerViewModel>> GetDsppartnersList();
        Task<IEnumerable<DsppartnerViewModel>> GetDsppartnersByName(string name, int dspid = 0);
        Task<IEnumerable<DsppartnerViewModel>> GetDsppartnersAllAsync(DsppartnerViewModel model);
        Task<DsppartnerViewModel> GetDsppartnersById(int id);
        Task<DsppartnerViewModel> Create(DsppartnerViewModel vModel);
        Task Update(DsppartnerViewModel model);
        Task Delete(DsppartnerViewModel model);
    }
    }

