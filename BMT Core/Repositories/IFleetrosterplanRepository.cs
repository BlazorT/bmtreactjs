using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IFleetrosterplanRepository : IRepositoryTransaction<Fleetrosterplan>
    {        
        Task<Fleetrosterplan> GetFleetrosterplanByIdSync(Int64 Id);
        Task<IEnumerable<Fleetrosterplan>> GetFleetrosterplansAllFiltersAsync(Fleetrosterplan model);
        Task<IEnumerable<Fleetrosterplan>> GetRosterPlasByRosterIdAsync(Int64 rosterId);
        Task<IEnumerable<Fleetrosterplan>> bulkaddorupdates(List<Fleetrosterplan> ls);
    }
}
