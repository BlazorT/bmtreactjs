using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IDspService
    {
        Task<IEnumerable<DspModel>> GetDspsByStatusList(int status);     
        Task<IEnumerable<DspModel>> GetDspsList(string details);
        Task<DspModel> GetDspByIdList(Int32 id);
        Task<IEnumerable<DspModel>> GetDspsAllListAsync(DspModel model);
        Task<DspModel> Create(DspModel model);
        Task Update(DspModel model);
        Task Delete(DspModel model);

    }
}
