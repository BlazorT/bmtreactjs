using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IDsppartnerService
    {
        Task<IEnumerable<DsppartnerModel>> GetDsppartnersByStatusList(int status, int dspid = 0);     
        Task<IEnumerable<DsppartnerModel>> GetDsppartnersList(string details);
        Task<DsppartnerModel> GetDsppartnerByIdList(Int32 id);
        Task<IEnumerable<DsppartnerModel>> GetDsppartnersAllListAsync(DsppartnerModel model);
        Task<IEnumerable<DsppartnerModel>> BulkAddorUpdates(List<DsppartnerModel> ls);
        Task<DsppartnerModel> Create(DsppartnerModel model);
        Task Update(DsppartnerModel model);
        Task Delete(DsppartnerModel model);

    }
}
