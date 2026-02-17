using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.util;
namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class NotificationService : INotificationService
    {
        private readonly INotificationsRepository _notificationsRepository;
        private readonly IAppLogger<NotificationService> _logger;
        private readonly IMapper _mapper;
        public NotificationService(INotificationsRepository notificationRepository, IMapper mapper, IAppLogger<NotificationService> logger)
        {
            _notificationsRepository = notificationRepository ?? throw new ArgumentNullException(nameof(notificationRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
               
        public async Task<IEnumerable<NotificationModel>> GetNotificationList()
        {
            var list = await _notificationsRepository.GetNotificationsListAsync();          
            var mapped = _mapper.Map<IEnumerable<NotificationModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<NotificationModel>> GetNotificationBySearchKeyword(string keyword)
        {
            var list = await _notificationsRepository.GetNotificationsByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<NotificationModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<NotificationModel>> GetNotificationDetails(NotificationModel notificationModel)
        {
            var entity = _mapper.Map<Notification>(notificationModel);
            var list = await _notificationsRepository.GetNotificationsAllFiltersAsync(entity);
            var mapped = _mapper.Map<IEnumerable<NotificationModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<NotificationModel>> GetNotificationAllFiltersLogDetails(NotificationModel notificationModel)
        {
            var entity = _mapper.Map<Notification>(notificationModel);
            var list = await _notificationsRepository.GetNotificationsLogAllFiltersAsync(entity);
            var mapped = _mapper.Map<IEnumerable<NotificationModel>>(list);
            return mapped;
        }
        
        public async Task<NotificationModel> GetNotificationById(long notificaitonId )
        {
           // var entity = _mapper.Map<Notification>(notificationModel);
            var entity = await _notificationsRepository.GetNotificationByIdSync(notificaitonId);
            var mapped = _mapper.Map<NotificationModel>(entity);
            return mapped;
        }
        public async Task<IEnumerable<NotificationModel>> GetNotificationByDateRangeAndStatus(STATUS_NOTIFICATION status, DateTime dtFrom, DateTime dtTo) 
        {
            var entity = await _notificationsRepository.GetNotificationsAllFiltersAsync(new Notification {  ComaignId=0, CreatedBy=0, CreatedAt= dtFrom ,LastUpdatedAt= dtTo, Status=(int)status });
            var mapped = _mapper.Map<IEnumerable<NotificationModel>>(entity);
            return mapped;
        }

        //public async Task<IEnumerable<NotificationModel>> GetNotificatoinByUserId(int userId)
        //{
        //    var entity = await _notificationsRepository.get(userId);
        //    var mapped = _mapper.Map<IEnumerable<NotificationModel>>(entity);
        //    return mapped;
        //}

        public async Task<NotificationModel> Create(NotificationModel notificationModel)
        {
           // await ValidateEntityIfExist(notificationModel);

            var mappedEntity = _mapper.Map<Notification>(notificationModel);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _notificationsRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - BMTLogService");

            var newMappedEntity = _mapper.Map<NotificationModel>(newEntity);
            return newMappedEntity;
        }
        public async Task<IEnumerable<NotificationModel>> InsertUpdateBulk(List<NotificationModel> nlst)
        {
            // await ValidateEntityIfExist(notificationModel);

            var lst = _mapper.Map<IEnumerable<Notification>>(nlst);
            if (nlst == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _notificationsRepository.InsertUpdateBulk(lst.ToList());
            _logger.LogInformation($"Entity successfully added - BMTLogService");

            var newMappedEntity = _mapper.Map<IEnumerable<NotificationModel>>(newEntity);
            return newMappedEntity;
        }
        public async Task Update(NotificationModel notificationModel)
        {
          //  ValidateEntityIfNotExist(notificationModel);
            
            var entity = await _notificationsRepository.GetNotificationByIdSync(notificationModel.id);
            if (entity == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<NotificationModel, Notification>(notificationModel, entity);

            await _notificationsRepository.UpdateAsync(entity);
            _logger.LogInformation($"Entity successfully updated - BMTLogService");
        }

        public async Task Delete(NotificationModel notificationModel)
        {
           //  ValidateEntityIfNotExist(notificationModel);
            var deletedProduct = await _notificationsRepository.GetNotificationByIdSync(notificationModel.id);
            if (deletedProduct == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _notificationsRepository.DeleteAsync(deletedProduct);
            _logger.LogInformation($"Entity successfully deleted - BMTLogService");
        }

        private async Task ValidateEntityIfExist(NotificationModel notificationModel)
        {
            var existingEntity = await _notificationsRepository.GetNotificationByIdSync(notificationModel.id);
            if (existingEntity != null)
                throw new ApplicationException($"{notificationModel.Subject.ToString()} with this id already exists");
        }

        private void ValidateEntityIfNotExist(NotificationModel notificationModel)
        {
            var existingEntity = _notificationsRepository.GetNotificationByIdSync(notificationModel.id);
            if (existingEntity == null)
                throw new ApplicationException($"{notificationModel.Subject.ToString()} with this subject is not exists");
        }
    }
}
