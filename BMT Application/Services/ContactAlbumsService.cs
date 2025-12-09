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
    public class ContactAlbumsService : IContactAlbumService
    {
        private readonly IContactsAlbumRepository _contactAlbumsRepository;
        private readonly IAppLogger<ContactAlbumsService> _logger;
        private readonly IMapper _mapper;
        public ContactAlbumsService(IContactsAlbumRepository contactAlbumsRepository, IMapper mapper, IAppLogger<ContactAlbumsService> logger)
        {
            _contactAlbumsRepository = contactAlbumsRepository ?? throw new ArgumentNullException(nameof(contactAlbumsRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        
        }
       
        public async Task<IEnumerable<ContactsalbumModel>> GetContactAlbumsByNetworkAndOrgList(int NetworkId, int OrgId) {
            var List = await _contactAlbumsRepository.GetContactAlbumsByNetworkLAndOrgist(NetworkId, OrgId);
            var mapped = _mapper.Map<IEnumerable<ContactsalbumModel>>(List);
            return mapped;
        }
        public async Task<IEnumerable<ContactsalbumModel>> GetContactAlbumsAlFiltersList(ContactsalbumModel model)
        {
            var entity = _mapper.Map<Contactsalbum>(model);
            var List = await _contactAlbumsRepository.GetContactAlbumsListAllFilters(entity);
            var mapped = _mapper.Map<IEnumerable<ContactsalbumModel>>(List);
            return mapped;
        }
        public async Task<ContactsalbumModel> GetContactAlbumById(Int64 id)
        {
            var List = await _contactAlbumsRepository.GetContactAlbumsByIdAsnc(id);
            var mapped = _mapper.Map<ContactsalbumModel>(List);
            return mapped;
        }

        public async Task<ContactsalbumModel> Create(ContactsalbumModel model)
        {
            // await ValidateProductIfExist(PaymentModel);

            var mappedEntity = _mapper.Map<Contactsalbum>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _contactAlbumsRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - PaymentService");

            var newMappedEntity = _mapper.Map<ContactsalbumModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(ContactsalbumModel model)
        {
            // ValidateProductIfNotExist(PaymentModel);

            var editEntity = await _contactAlbumsRepository.GetContactAlbumsByIdAsnc(model.Id);
            if (editEntity == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<ContactsalbumModel, Contactsalbum>(model, editEntity);

            await _contactAlbumsRepository.UpdateAsync(editEntity);
            _logger.LogInformation($"Entity successfully updated - PaymentService");
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
