using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class NotificationService : INotificationService
    {
             
        private readonly INotificationsRepository _notificationsRepository;
        private readonly IAppLogger<NotificationService> _logger;
        private readonly IMapper _mapper;
        public NotificationService(INotificationsRepository notificationsRepository, IMapper mapper, IAppLogger<NotificationService> logger)
        {
            _notificationsRepository = notificationsRepository ?? throw new ArgumentNullException(nameof(notificationsRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        //private object NotificationService()
        //{
        //    throw new NotImplementedException();
        //}       
               
        public async Task<IEnumerable<NotificationModel>> GetNotificationList()
        {
            var lst = await _notificationsRepository.GetAllAsync();          
            var mapped = _mapper.Map<IEnumerable<NotificationModel>>(lst);
            return mapped;
        }
        public async Task<IEnumerable<NotificationModel>> GetNotificationsByName(string name)
        {
            var lst = await _notificationsRepository.GetNotificationsByNameAsync(name);
            var mapped = _mapper.Map<IEnumerable<NotificationModel>>(lst);
            return mapped;
        }
      
        public async Task<NotificationModel> GetNotificationById(Int64 id)
        {
            var model = await _notificationsRepository.GetNotificationByIdSync(id);
            var mapped = _mapper.Map<NotificationModel>(model);
            return mapped;
        }

        public async Task<IEnumerable<NotificationModel>> GetNotificationsByCategoryAndStatusAsnc(int showRoomId, int status) {
            var lst = await _notificationsRepository.GetNotificationsByCategoryAndStatusAsnc(showRoomId, status);
            var mList = _mapper.Map<IEnumerable<NotificationModel>>(lst);
            return mList;
        }
        public async Task<IEnumerable<NotificationModel>> GetNotificationsAllFiltersAsync(NotificationModel model)
        {
            var vModel = _mapper.Map<NotificationModel, Notification>(model);
            var vLst = await _notificationsRepository.GetNotificationsAllFiltersAsync(vModel);
            var mList = _mapper.Map<IEnumerable<NotificationModel>>(vLst);
            return mList;
        }

        public async Task<NotificationModel> Create(NotificationModel model)
        {
            await ValidateProductIfExist(model);

            var mappedEntity = _mapper.Map<NotificationModel, Notification>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _notificationsRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - NotificationService");

            var newMappedEntity = _mapper.Map<NotificationModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(NotificationModel model)
        {
            ValidateProductIfNotExist(model);
            
            var edit = await _notificationsRepository.GetNotificationByIdSync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<NotificationModel, Notification>(model, edit);

            await _notificationsRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - NotificationService");
        }

        public async Task Delete(NotificationModel model)
        {
            ValidateProductIfNotExist(model);
            var vModel = await _notificationsRepository.GetNotificationByIdSync(model.id);
            if (vModel == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _notificationsRepository.DeleteAsync(vModel);
            _logger.LogInformation($"Entity successfully deleted - NotificationService");
        }

        private async Task ValidateProductIfExist(NotificationModel model)
        {
            var existingEntity = await _notificationsRepository.GetNotificationByIdSync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }

        private void ValidateProductIfNotExist(NotificationModel model)
        {
            var existingEntity = _notificationsRepository.GetNotificationByIdSync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");
        }
    }
}
