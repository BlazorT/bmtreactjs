using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IRosterplanRepository : IRepositoryTransaction<Rosterplan>
    {
        Task<Rosterplan> GetRosterPlanByIdSync(Int64 id);
        Task<IEnumerable<Rosterplan>> GetRosterPlasByNameAsync(int dspId);
        Task<IEnumerable<Vehicle>> GetRosterPlasByDspAndStatusAsnc(int dspId, int status);
        Task<IEnumerable<Rosterplan>> GetRosterPlasAllFiltersAsync(Rosterplan model);
        Task<IEnumerable<Rosterplan>> bulkaddorupdates(List<Rosterplan> ls);
    }
}
