using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Blazor.Web.Application.Interfaces;
using AutoMapper;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class CampaignRecipientService : ICampaignRecipientService
    {
        private readonly ICampaignRecipientsRepository _campaignRecipientsRepository;
        private readonly IAppLogger<CampaignRecipientService> _logger;
        private readonly IMapper _mapper;
        public CampaignRecipientService(ICampaignRecipientsRepository campaignRecipientsRepository, IMapper mapper, IAppLogger<CampaignRecipientService> logger)
        {
            _campaignRecipientsRepository = campaignRecipientsRepository ?? throw new ArgumentNullException(nameof(campaignRecipientsRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        
        }      
        public async Task<IEnumerable<CompaignrecipientModel>> GetCampaignRecipientsByNetworkAndOrgList(int NetworkId, int OrgId) {
            var List = await _campaignRecipientsRepository.GetCompaignrecipientsByNetworkLAndOrgist(NetworkId, OrgId);
            var mapped = _mapper.Map<IEnumerable<CompaignrecipientModel>>(List);
            return mapped;
        }
        public async Task<IEnumerable<CompaignrecipientModel>> GetCampaignRecipientsAlFiltersList(CompaignrecipientModel model)
        {
            var entity = _mapper.Map<Compaignrecipient>(model);
            var List = await _campaignRecipientsRepository.GetCampaignRecipientsListAllFilters(entity);
            var mapped = _mapper.Map<IEnumerable<CompaignrecipientModel>>(List);
            return mapped;
        }
        public async Task<CompaignrecipientModel> GetCampaignRecipientsById(Int64 id)
        {
            var List = await _campaignRecipientsRepository.GetCompaignRecipientByIdAsnc(id);
            var mapped = _mapper.Map<CompaignrecipientModel>(List);
            return mapped;
        }
        //public async Task<IEnumerable<CityModel>> GetCitiesByStatusList(int status)
        //{
        //    var list = await _cityRepository.GetCitiesByStatusList(status);          
        //    var mapped = _mapper.Map<IEnumerable<CityModel>>(list);
        //    return mapped;
        //}
        //public async Task<IEnumerable<CityModel>> GetCitiesList(string keyword)
        //{
        //    var List = await _cityRepository.GetCitiesList(keyword);
        //    var mapped = _mapper.Map<IEnumerable<CityModel>>(List);
        //    return mapped;
        //}

        //public async Task<IEnumerable<CityModel>> GetCitiesListByState(int state)
        //{
        //    var List = await _cityRepository.GetCitiesListByState(state);
        //    var mapped = _mapper.Map<IEnumerable<CityModel>>(List);
        //    return mapped;
        //}

    }
}
