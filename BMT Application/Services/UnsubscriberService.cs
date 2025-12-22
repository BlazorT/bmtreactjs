using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    public partial class UnsubscriberService : IUnsubscriberService
    {

        private readonly IUnsubscriberRepository _unsubscriberRepository;
        private readonly IAppLogger<UnsubscriberService> _logger;
        private readonly IMapper _mapper;
        public UnsubscriberService(IUnsubscriberRepository unsubscriberRepository, IMapper mapper, IAppLogger<UnsubscriberService> logger)
        {
            _unsubscriberRepository = unsubscriberRepository ?? throw new ArgumentNullException(nameof(unsubscriberRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

       // Task<IEnumerable<UnsubscriberModel>> GetUnsubscribersListAllFiltersAsync(UnsubscriberModel compaign);
        public async Task<IEnumerable<UnsubscriberModel>> GetUnsubscribersListByContactIdAsync(string contacid)
        {
            var mediaContentList = await _unsubscriberRepository.GetUnsubscribersByContactIdAsync(contacid);
            var mapped = _mapper.Map<IEnumerable<UnsubscriberModel>>(mediaContentList);
            return mapped;
        }
        public async Task<UnsubscriberModel> GetUnsubscriberByIdAsync(Int64 id)
        {
            var mediaContentList = await _unsubscriberRepository.GetUnsubscribersByIdAsync(id);
            var mapped = _mapper.Map<UnsubscriberModel>(mediaContentList);
            return mapped;
        }
        public async Task<IEnumerable<UnsubscriberModel>> GetUnsubscribersListByNetworkIdAsync(Int32 networkid)
        {
              //  var entity = _mapper.Map<Unsubscriber>(model);
                var mediaContentList = await _unsubscriberRepository.GetUnsubscribersByNetworkIdAsync(networkid);
            var mapped = _mapper.Map<IEnumerable<UnsubscriberModel>>(mediaContentList);
            return mapped;
        }
        public async Task<IEnumerable<UnsubscriberModel>> GetUnsubscribersListAllFiltersAsync(UnsubscriberModel model)
        {
            var entity = _mapper.Map<Unsubscriber>(model);
            var mediaContentList = await _unsubscriberRepository.GetUnsubscribersByAllFiltersAsync(entity);
            var mapped = _mapper.Map<IEnumerable<UnsubscriberModel>>(mediaContentList);
            return mapped;
        }
        public async Task<List<UnsubscriberModel>> Create(List<UnsubscriberModel> models)
        {
            var resultList = new List<UnsubscriberModel>();

            foreach (var model in models)
            {
                var mappedEntity = _mapper.Map<Unsubscriber>(model);
                if (mappedEntity == null) throw new ApplicationException("Entity could not be mapped.");

                var newEntity = await _unsubscriberRepository.AddAsync(mappedEntity);
                _logger.LogInformation("Entity successfully added - UnsubscriberService");

                var newMappedEntity = _mapper.Map<UnsubscriberModel>(newEntity);
                resultList.Add(newMappedEntity);
            }

            return resultList;
        }

        public async Task Update(UnsubscriberModel model)
        {
            // ValidateProductIfNotExist(PaymentModel);

            var editEntity = await _unsubscriberRepository.GetUnsubscribersByIdAsync(model.Id);
            if (editEntity == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<UnsubscriberModel, Unsubscriber>(model, editEntity);

            await _unsubscriberRepository.UpdateAsync(editEntity);
            _logger.LogInformation($"Entity successfully updated - PaymentService");
        }

        public async Task Delete(UnsubscriberModel model)
        {
            // ValidateProductIfNotExist(PaymentModel);
            var deletedProduct = await _unsubscriberRepository.GetUnsubscribersByIdAsync(model.Id);
            if (deletedProduct == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _unsubscriberRepository.DeleteAsync(deletedProduct);
            _logger.LogInformation($"Entity successfully deleted - PaymentService");
        }

    }
}
