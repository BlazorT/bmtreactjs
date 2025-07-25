using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Blazor.Web.Application.Interfaces;
using AutoMapper;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.application.model;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class CampaignTemplateService : ICampaignTemplateService
    {
        private readonly ICampaignTemplateRepository _campaignTemplateRepository;
        private readonly IAppLogger<CampaignTemplateService> _logger;
        private readonly IMapper _mapper;
        public CampaignTemplateService(ICampaignTemplateRepository campaignTemplateRepository, IMapper mapper, IAppLogger<CampaignTemplateService> logger)
        {
            _campaignTemplateRepository = campaignTemplateRepository ?? throw new ArgumentNullException(nameof(campaignTemplateRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        
        }

        public async Task<IEnumerable<CompaigntemplateModel>> GetCampaignTemplatesByNetworkList(int NetworkId) {
            var List = await _campaignTemplateRepository.GetCompaigntemplatesByNetworkList(NetworkId);
            var mapped = _mapper.Map<IEnumerable<CompaigntemplateModel>>(List);
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
