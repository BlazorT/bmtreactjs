using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class OrganizationService : IOrganizationService
    {
        private readonly IOrganizationRepository _OrgRepository;
        private readonly IOrgPackageDetailRepository _0rgPackageDetailRepository;
        private readonly IAppLogger<OrganizationService> _logger;
        private readonly IMapper _mapper;
        public OrganizationService(IOrganizationRepository orgRepository, IOrgPackageDetailRepository orgPackageDetailRepository, IMapper mapper, IAppLogger<OrganizationService> logger)
        {
            _OrgRepository = orgRepository ?? throw new ArgumentNullException(nameof(orgRepository));
            _0rgPackageDetailRepository = orgPackageDetailRepository ?? throw new ArgumentNullException(nameof(orgPackageDetailRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }       
        public async Task<IEnumerable<OrgpackagedetailModel>> GetOrgPackageDetailsBynetworkAndOrgAsync(int networkid, int orgid)
        {
            var list = await _0rgPackageDetailRepository.GetOrgPackageDetailsBynetworkAndOrgAsync(networkid, orgid);
            var mapped = _mapper.Map<IEnumerable<OrgpackagedetailModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<OrgpackagedetailModel>> GetOrgPackageDetailByNameAsync(string name)
        {
            var list = await _0rgPackageDetailRepository.GetOrgPackageDetailByNameAsync(name);
            var mapped = _mapper.Map<IEnumerable<OrgpackagedetailModel>>(list);
            return mapped;
        }
        public async Task<OrgpackagedetailModel> GetOrgPackageDetailseAsync(Int64 Id)
        {
            var list = await _0rgPackageDetailRepository.GetOrgPackageDetailseAsync(Id);
            var mapped = _mapper.Map<OrgpackagedetailModel>(list);
            return mapped;
        }
        public async Task<IEnumerable<OrgpackagedetailModel>> GetOrgPackageDetailsAllFiltersAsync(OrgpackagedetailModel model)
        {
            var sModel = _mapper.Map<Orgpackagedetail>(model);
            var list = await _0rgPackageDetailRepository.GetOrgPackageDetailsAllFiltersAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<OrgpackagedetailModel>>(list);
            return mapped;
        }

        public async Task<IEnumerable<OrganizationModel>> GetOrgsByStatusList(int status)
        {
            var list = await _OrgRepository.GetOrgListByStatusAsync(status);
            var mapped = _mapper.Map<IEnumerable<OrganizationModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<OrganizationModel>> GetOrgsList(string keyword)
        {
            var userList = await _OrgRepository.GetOrgByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<OrganizationModel>>(userList);
            return mapped;
        }
        public async Task<IEnumerable<OrganizationModel>> GetOrgsAllListAsync(OrganizationModel model)
        {
            var sModel = _mapper.Map<Organization>(model);
            var userList = await _OrgRepository.GetOrgAllFiltersAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<OrganizationModel>>(userList);
            return mapped;
        }

        public async Task<OrganizationModel> GetOrgByIdList(Int32 id)
        {
            var org = await _OrgRepository.GetOrgByIDeAsync(id);
            var mapped = _mapper.Map<OrganizationModel>(org);
            return mapped;
        }
        public async Task<OrganizationModel> Create(OrganizationModel model)
        {
            await ValidateProductIfExist(model);
          //  model.IsMainDsp = 0;
            var mappedEntity = _mapper.Map<OrganizationModel, Organization>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _OrgRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - OrganizationService");

            var newMappedEntity = _mapper.Map<OrganizationModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(OrganizationModel model)
        {          
            var edit = await _OrgRepository.GetOrgByIDeAsync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");
            model.RowVer = edit.RowVer + 1;
            model.CreatedAt = edit.CreatedAt;
            model.CreatedBy = edit.CreatedBy;
           // model.IsMainDsp = edit.IsMainDsp;
            _mapper.Map<OrganizationModel, Organization>(model, edit);
            await _OrgRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - OrganizationService");
        }

        public async Task Delete(OrganizationModel model)
        {
            ValidateProductIfNotExist(model);
            var vehicle = await _OrgRepository.GetOrgByIDeAsync(model.id);
            if (vehicle == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _OrgRepository.DeleteAsync(vehicle);
            _logger.LogInformation($"Entity successfully deleted - OrganizationService");
        }

        private async Task ValidateProductIfExist(OrganizationModel model)
        {
            var existingEntity = await _OrgRepository.GetOrgByIDeAsync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }

        private void ValidateProductIfNotExist(OrganizationModel model)
        {
            var existingEntity = _OrgRepository.GetOrgByIDeAsync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");


        }
    }
}
