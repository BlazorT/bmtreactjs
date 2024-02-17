using AutoMapper;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.model;
using System.Collections.Generic;
using com.blazor.bmt.application.services;
using com.blazor.bmt.util;

namespace com.blazor.bmt.ui.services
{
    public class RosterPlanPageService : IRosterPlanPageService
    {
        private readonly IRosterplanService _rosterplanService;       
        //private readonly ICategoryService _categoryAppService;
        private readonly IMapper _mapper;
        private readonly ILogger<RosterPlanPageService> _logger;

        public RosterPlanPageService(IRosterplanService rosterplanService, IMapper mapper, ILogger<RosterPlanPageService> logger)
        {
            _rosterplanService = rosterplanService ?? throw new ArgumentNullException(nameof(rosterplanService));
           // _vehicleInspectionService = vehicleInspectionService ?? throw new ArgumentNullException(nameof(vehicleInspectionService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }         
       
        public async Task<RosterplanViewModel> GetRosterPlanByIdSync(Int64 id)
        {          
            var list = await _rosterplanService.GetRosterPlanByIdSync(id);
            var mapped = _mapper.Map<RosterplanViewModel>(list);
            return mapped;
        }

        public async Task<RosterplanViewModel> GetRosterPlanWithFleetPlansByIdSync(Int64 rosterId)
        {
            var entity = await _rosterplanService.GetRosterPlanByIdSync(rosterId);
            var mapped = _mapper.Map<RosterplanViewModel>(entity);

            var flst = await _rosterplanService.GetFleetRosterPlansByRosterIdSync(rosterId);
           // var mlst = _mapper.Map<RosterplanViewModel>(flst);

            var mlst = _mapper.Map<IEnumerable<FleetrosterplanViewModel>>(flst);

            mapped.fleetplans = mlst.ToList();
            return mapped;
        }
        public async Task<FleetrosterplanViewModel> GetFleetRosterPlanByIdSync(Int64 id)
        {
            var list = await _rosterplanService.GetFleetRosterPlansByIdSync(id);
            var mapped = _mapper.Map<FleetrosterplanViewModel>(list);
            return mapped;
        }
        public async Task<IEnumerable<FleetrosterplanViewModel>> GetFleetRosterPlansByRosterIdSync(Int64 rosterId)
        {
            var list = await _rosterplanService.GetFleetRosterPlansByRosterIdSync(rosterId);
            var mlst = _mapper.Map<IEnumerable<FleetrosterplanViewModel>>(list);
            return mlst;
            
        }
        public async Task<IEnumerable<RosterplanViewModel>> GetRosterPlasByDspAndStatusAsnc(int dspId, int status)
        {
            var lst = await _rosterplanService.GetRosterPlasByDspAndStatusAsnc(dspId, status);
            // Items List
            var mlst = _mapper.Map<IEnumerable<RosterplanViewModel>>(lst);
            return mlst;
          
        }
        public async Task<IEnumerable<RosterplanViewModel>> GetRosterPlasAllFiltersAsync(RosterplanViewModel model)
        {
            var mapped = _mapper.Map<RosterplanModel>(model);
            var list = await _rosterplanService.GetRosterPlasAllFiltersAsync(mapped);
            var lst = _mapper.Map<IEnumerable<RosterplanViewModel>>(list);
            return lst;
        }
        public async Task<IEnumerable<FleetrosterplanViewModel>> GetFleetRosterPlasAllFiltersAsync(FleetrosterplanViewModel model)
        {
            var mapped = _mapper.Map<FleetrosterplanModel>(model);
            var list = await _rosterplanService.GetFleetRosterPlasAllFiltersAsync(mapped);
            var lst = _mapper.Map<IEnumerable<FleetrosterplanViewModel>>(list);
            return lst;
        }
        public async Task<RosterplanViewModel> UpdateRosterWithFleet(RosterplanViewModel model)
        {
            var mapped = _mapper.Map<RosterplanModel>(model);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _rosterplanService.Update(mapped);

            if (model.Id > 0 && model.fleetplans != null && model.fleetplans.Any())
            {
                List<FleetrosterplanModel> ls = new List<FleetrosterplanModel>();
                foreach (FleetrosterplanViewModel fItem in model.fleetplans)
                {
                    ls.Add(new FleetrosterplanModel { id = fItem.Id, HelperDriverId= fItem.HelperDriverId, RosterId= model.Id, RosterRemarks = fItem.RosterRemarks, VehicleId = fItem.VehicleId, Wincode = fItem.Wincode, ScheduleDate = fItem.ScheduleDate, Status = fItem.Status, CreatedAt = GlobalUTIL.CurrentDateTime, CreatedBy = Convert.ToInt32(fItem.CreatedBy), LastUpdatedBy = Convert.ToInt32(fItem.CreatedBy), LastUpdatedAt = fItem.LastUpdatedAt, RosteredDaid= fItem.RosteredDaid, RowVer=1, CustomField1= fItem.CustomField1 });
                }
                await _rosterplanService.CreateorupdateFleetRosterPlans(ls);

            }
            _logger.LogInformation($"Entity successfully added - RosterPlanPageService");

            var mappedViewModel = _mapper.Map<RosterplanViewModel>(model);
            return mappedViewModel;
        }
        public async Task<RosterplanViewModel> CreateRosterWithFleet(RosterplanViewModel model)
        {
            var mapped = _mapper.Map<RosterplanModel>(model);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            RosterplanModel rModel= await _rosterplanService.Create(mapped);
            List<FleetrosterplanModel> ls = new List<FleetrosterplanModel>();
            List<FleetrosterplanViewModel> vls = new List<FleetrosterplanViewModel>();
            if (rModel.id > 0 && model.fleetplans != null && model.fleetplans.Any())
            {
                
                foreach (FleetrosterplanViewModel fItem in model.fleetplans)
                {
                    ls.Add(new FleetrosterplanModel { id = fItem.Id, HelperDriverId = fItem.HelperDriverId, RosterId = rModel.id, RosterRemarks = fItem.RosterRemarks, VehicleId = fItem.VehicleId, ScheduleDate = fItem.ScheduleDate, Wincode = fItem.Wincode, Status = fItem.Status, CreatedAt = GlobalUTIL.CurrentDateTime, CreatedBy = Convert.ToInt32(fItem.CreatedBy), LastUpdatedBy = Convert.ToInt32(fItem.CreatedBy), LastUpdatedAt = fItem.LastUpdatedAt, RosteredDaid = fItem.RosteredDaid, RowVer = 1, CustomField1 = fItem.CustomField1 });
                }
                var flist=  await _rosterplanService.CreateorupdateFleetRosterPlans(ls);

                vls = _mapper.Map<IEnumerable<FleetrosterplanViewModel>>(flist).ToList();

            }
            _logger.LogInformation($"Entity successfully added - RosterPlanPageService");

            var mappedViewModel = _mapper.Map<RosterplanViewModel>(rModel);
            if (ls != null && ls.Any())
                mappedViewModel.fleetplans = vls;
            return mappedViewModel;
        }
    
        public async Task<RosterplanViewModel> Create(RosterplanViewModel vModel)
        {
            var mapped = _mapper.Map<RosterplanModel>(vModel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            var entityDto = await _rosterplanService.Create(mapped);
            _logger.LogInformation($"Entity successfully added - RosterPlanPageService");

            var mappedViewModel = _mapper.Map<RosterplanViewModel>(entityDto);
            return mappedViewModel;
        }

        public async Task Update(RosterplanViewModel vmodel)
        {
            var mapped = _mapper.Map<RosterplanModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _rosterplanService.Update(mapped);
            _logger.LogInformation($"Entity successfully added - RosterPlanPageService");
        }

        public async Task Delete(RosterplanViewModel vmodel){
            var mapped = _mapper.Map<RosterplanModel>(vmodel);
            if (mapped == null)
                throw new Exception($"Entity could not be mapped.");

            await _rosterplanService.Delete(mapped);
            _logger.LogInformation($"Entity successfully added - RosterPlanPageService");
        }
    }
}
