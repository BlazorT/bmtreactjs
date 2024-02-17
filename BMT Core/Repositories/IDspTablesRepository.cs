using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IDspTablesRepository : IRepositoryTransaction<Dspstable>
    {
        Task<Dspstable> GetDspTableleByIdSync(Int64 id);
        Task<IEnumerable<Dspstable>> GetDspTableleByTableIdSync(int tid);
        Task<IEnumerable<Dspstable>> GetDspTablesAllFiltersAsync(Dspstable model);
        Task<IEnumerable<Dspstable>> GetDspTablesByColumnAndStatusAsnc(int columnIndex, int status);
        Task<IEnumerable<Dspstable>> GetDspTablesByNameAsync(string Name);       
    }
}
