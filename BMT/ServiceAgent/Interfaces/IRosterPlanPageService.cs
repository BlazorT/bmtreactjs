using com.blazor.bmt.viewmodels;
namespace com.blazor.bmt.ui.interfaces
{
    public interface IRosterPlanPageService 
    {

        Task<RosterplanViewModel> GetRosterPlanByIdSync(Int64 id);
        Task<FleetrosterplanViewModel> GetFleetRosterPlanByIdSync(Int64 id);
        Task<IEnumerable<FleetrosterplanViewModel>> GetFleetRosterPlansByRosterIdSync(Int64 rosterId);
        Task<RosterplanViewModel> GetRosterPlanWithFleetPlansByIdSync(Int64 rosterId);
        Task<IEnumerable<RosterplanViewModel>> GetRosterPlasByDspAndStatusAsnc(int dspId, int status);
        Task<IEnumerable<FleetrosterplanViewModel>> GetFleetRosterPlasAllFiltersAsync(FleetrosterplanViewModel model);
        Task<IEnumerable<RosterplanViewModel>> GetRosterPlasAllFiltersAsync(RosterplanViewModel model);
        Task<RosterplanViewModel> CreateRosterWithFleet(RosterplanViewModel model);
        Task<RosterplanViewModel> UpdateRosterWithFleet(RosterplanViewModel model);
        Task<RosterplanViewModel> Create(RosterplanViewModel vModel);
        Task Update(RosterplanViewModel vmodel);
        Task Delete(RosterplanViewModel vmodel);
    }
}
