using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IDspTablesService
    {
        Task<DspstableModel> GetDspTableleByIdSync(Int64 id);
        Task<IEnumerable<DspstableModel>> GetDspTableleByTableIdSync(int tid);
        Task<IEnumerable<DspstableModel>> GetDspTablesAllFiltersAsync(DspstableModel model);
        Task<IEnumerable<DspstableModel>> GetDspTablesByColumnAndStatusAsnc(int columnIndex, int status);
        Task<IEnumerable<DspstableModel>> GetDspTablesByNameAsync(string Name);
    }
}
