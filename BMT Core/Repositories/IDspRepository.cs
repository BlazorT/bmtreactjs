using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IDspRepository : IRepository<Dsp>
    {
        Task<IEnumerable<Dsp>> GetDspListByStatusAsync(int status);
        Task<IEnumerable<Dsp>> GetDspByNameAsync(string name);
        Task<IEnumerable<Dsp>> GetDspAllFiltersAsync(Dsp model);
        Task<Dsp> GetDspByIDeAsync(Int32 id);


    }
}
