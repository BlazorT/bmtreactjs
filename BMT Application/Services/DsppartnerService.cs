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
    public class DsppartnerService : IDsppartnerService
    {
        private readonly IDsppartnerRepository _partnerRepository;
        private readonly IAppLogger<DsppartnerService> _logger;
        private readonly IMapper _mapper;
        public DsppartnerService(IDsppartnerRepository partnerRepository, IMapper mapper, IAppLogger<DsppartnerService> logger)
        {
            _partnerRepository = partnerRepository ?? throw new ArgumentNullException(nameof(partnerRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        public async Task<IEnumerable<DsppartnerModel>> GetDsppartnersByStatusList(int status,int dspid= 0)
        {
            var list = await _partnerRepository.GetDspPartnersListByStatusAsync(dspid,status);
            var mapped = _mapper.Map<IEnumerable<DsppartnerModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<DsppartnerModel>> GetDsppartnersList(string keyword)
        {
            var userList = await _partnerRepository.GetDspPartnersByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<DsppartnerModel>>(userList);
            return mapped;
        }
        public async Task<IEnumerable<DsppartnerModel>> GetDsppartnersAllListAsync(DsppartnerModel model)
        {
            var sModel = _mapper.Map<Dsppartner>(model);
            var userList = await _partnerRepository.GetDspPartnersAllFiltersAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<DsppartnerModel>>(userList);
            return mapped;
        }

        public async Task<DsppartnerModel> GetDsppartnerByIdList(Int32 id)
        {
            var store = await _partnerRepository.GetDspPartnersByIDeAsync(id);
            var mapped = _mapper.Map<DsppartnerModel>(store);
            return mapped;
        }
        public async Task<DsppartnerModel> Create(DsppartnerModel model)
        {
            await ValidateProductIfExist(model);
         
            var mappedEntity = _mapper.Map<DsppartnerModel, Dsppartner>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _partnerRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - DsppartnerService");

            var newMappedEntity = _mapper.Map<DsppartnerModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(DsppartnerModel model)
        {          
            var edit = await _partnerRepository.GetDspPartnersByIDeAsync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");
            model.RowVer = edit.RowVer + 1;
            model.CreatedAt = edit.CreatedAt;
            model.CreatedBy = edit.CreatedBy;
            //model.IsMainDsp = edit.IsMainDsp;
            _mapper.Map<DsppartnerModel, Dsppartner>(model, edit);
            await _partnerRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - DsppartnerService");
        }

        public async Task Delete(DsppartnerModel model)
        {
            ValidateProductIfNotExist(model);
            var vehicle = await _partnerRepository.GetDspPartnersByIDeAsync(model.id);
            if (vehicle == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _partnerRepository.DeleteAsync(vehicle);
            _logger.LogInformation($"Entity successfully deleted - DsppartnerService");
        }

        private async Task ValidateProductIfExist(DsppartnerModel model)
        {
            var existingEntity = await _partnerRepository.GetDspPartnersByIDeAsync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }
        public async Task<IEnumerable<DsppartnerModel>> BulkAddorUpdates(List<DsppartnerModel> ls)
        {
            var incList = _mapper.Map<IEnumerable<Dsppartner>>(ls);
            var vLst = await _partnerRepository.bulkaddorupdates(incList.ToList());
            var retLs = _mapper.Map<IEnumerable<DsppartnerModel>>(vLst);

            return retLs;
        }
        private void ValidateProductIfNotExist(DsppartnerModel model)
        {
            var existingEntity = _partnerRepository.GetDspPartnersByIDeAsync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");


        }
    }
}
