using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IRosterplanService 
    {
        Task<RosterplanModel> GetRosterPlanByIdSync(Int64 id);
        Task<IEnumerable<RosterplanModel>> GetRosterPlasByDspAndStatusAsnc(int dspId, int status);
        Task<IEnumerable<RosterplanModel>> GetRosterPlasAllFiltersAsync(RosterplanModel model);
        Task<FleetrosterplanModel> GetFleetRosterPlansByIdSync(Int64 fleetRosterId);
        Task<IEnumerable<FleetrosterplanModel>> GetFleetRosterPlansByRosterIdSync(Int64 RosterId);
        Task<IEnumerable<FleetrosterplanModel>> GetFleetRosterPlasAllFiltersAsync(FleetrosterplanModel model);
        Task<IEnumerable<FleetrosterplanModel>> CreateorupdateFleetRosterPlans(List<FleetrosterplanModel> ls);
       // Task<RosterplanModel> CreateRosterPlanWithItems(RosterplanModel model);
        Task<RosterplanModel> Create(RosterplanModel model);
        Task Update(RosterplanModel model);
        Task Delete(RosterplanModel model);
    }
}
