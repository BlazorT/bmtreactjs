using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IFleetrosterplanService 
    {        
        Task<FleetrosterplanModel> GetFleetrosterplanByIdSync(Int64 Id);
        Task<IEnumerable<FleetrosterplanModel>> GetFleetrosterplansAllFiltersAsync(FleetrosterplanModel model);
        Task<IEnumerable<FleetrosterplanModel>> GetFleetRosterPlasByRosterIdAsync(Int64 rosterId);              
    }
}
