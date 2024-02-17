using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class RosterplanService : IRosterplanService
    {
        private readonly IRosterplanRepository _rosterplanRepository;
        private readonly IFleetrosterplanRepository _fleetrosterplanRepository;
        private readonly IAppLogger<RosterplanService> _logger;
        private readonly IMapper _mapper;
        public RosterplanService(IRosterplanRepository rosterplanRepository, IFleetrosterplanRepository fleetrosterplanRepository, IMapper mapper, IAppLogger<RosterplanService> logger)
        {
            _rosterplanRepository = rosterplanRepository ?? throw new ArgumentNullException(nameof(rosterplanRepository));
            _fleetrosterplanRepository = fleetrosterplanRepository ?? throw new ArgumentNullException(nameof(fleetrosterplanRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
   
        private object VehicleRepository()
        {
            throw new NotImplementedException();
        }    
  
        public async Task<RosterplanModel> GetRosterPlanByIdSync(Int64 id)
        {
            var lst = await _rosterplanRepository.GetRosterPlanByIdSync(id);          
            var mapped = _mapper.Map<RosterplanModel>(lst);
            return mapped;
        }
        public async Task<IEnumerable<FleetrosterplanModel>> GetFleetRosterPlansByRosterIdSync(Int64 RosterId)
        {
            var lst = await _fleetrosterplanRepository.GetRosterPlasByRosterIdAsync(RosterId);
            var mList = _mapper.Map<IEnumerable<FleetrosterplanModel>>(lst);
            return mList;         
        }
        public async Task<FleetrosterplanModel> GetFleetRosterPlansByIdSync(Int64 fleetRosterId)
        {
            var lst = await _fleetrosterplanRepository.GetFleetrosterplanByIdSync(fleetRosterId);
            var mapped = _mapper.Map<FleetrosterplanModel>(lst);
            return mapped;
        }
        public async Task<IEnumerable<RosterplanModel>> GetRosterPlasByDspAndStatusAsnc(int dspId, int status)
        {
            var lst = await _rosterplanRepository.GetRosterPlasByDspAndStatusAsnc(dspId, status);
            var mList = _mapper.Map<IEnumerable<RosterplanModel>>(lst);
            return mList;
        }
        public async Task<IEnumerable<RosterplanModel>> GetRosterPlasAllFiltersAsync(RosterplanModel model)
        {
            var entity = _mapper.Map<RosterplanModel, Rosterplan>(model);
            var vLst = await _rosterplanRepository.GetRosterPlasAllFiltersAsync(entity);
            var mList = _mapper.Map<IEnumerable<RosterplanModel>>(vLst);
            return mList;
        }

        public async Task<IEnumerable<FleetrosterplanModel>> GetFleetRosterPlasAllFiltersAsync(FleetrosterplanModel model)
        {
            var entity = _mapper.Map<FleetrosterplanModel, Fleetrosterplan>(model);
            var vLst = await _fleetrosterplanRepository.GetFleetrosterplansAllFiltersAsync(entity);
            var mList = _mapper.Map<IEnumerable<FleetrosterplanModel>>(vLst);
            return mList;
        }
        public async Task<IEnumerable<FleetrosterplanModel>> CreateorupdateFleetRosterPlans(List<FleetrosterplanModel> ls)
        {
             // InspectionReportIfExist(model);

            var mList = _mapper.Map<IEnumerable<Fleetrosterplan>>(ls); // _mapper.Map<RosterplanModel, Rosterplan>(ls);
            if (mList == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var vUpdated = await _fleetrosterplanRepository.bulkaddorupdates(mList.ToList());           

            _logger.LogInformation($"Entity successfully added - RosterplanService");

            var newMappedEntity = _mapper.Map <IEnumerable<FleetrosterplanModel>>(vUpdated);
            return newMappedEntity;
        }
        public async Task<RosterplanModel> Create(RosterplanModel model)
        {
            //await ValidateProductIfExist(model);

            var mappedEntity = _mapper.Map<RosterplanModel, Rosterplan>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _rosterplanRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - RosterplanService");

            var newMappedEntity = _mapper.Map<RosterplanModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(RosterplanModel model)
        {
           // ValidateProductIfNotExist(model);
            
            var edit = await _rosterplanRepository.GetRosterPlanByIdSync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<RosterplanModel, Rosterplan>(model, edit);

            await _rosterplanRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - RosterPlanService");
        }

        public async Task Delete(RosterplanModel model)
        {
            InspectionReportIfExist(model);
            var inspection = await _rosterplanRepository.GetRosterPlanByIdSync(model.id);
            if (inspection == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _rosterplanRepository.DeleteAsync(inspection);
            _logger.LogInformation($"Entity successfully deleted - RosterPlanService");
        }

        private async Task ValidateProductIfExist(RosterplanModel model)
        {
            var existingEntity = await _rosterplanRepository.GetRosterPlanByIdSync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.id} with this id already exists");
        }
        private void InspectionReportIfExist(RosterplanModel model)
        {
            var existingEntity = _rosterplanRepository.GetRosterPlanByIdSync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.id} with this id is not exists");
        }
    }    
   
}
